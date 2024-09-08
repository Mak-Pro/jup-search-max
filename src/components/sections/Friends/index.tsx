"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { Board, Spacer, Button, Modal } from "@/components";
import { cssVariables } from "@/assets/styles/variables";
import styles from "./style.module.scss";
import Link from "next/link";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import { useTelegram } from "@/providers/telegram";
import { userAxios, headers } from "@/api";
import { FriendProps } from "@/Types";
import AppContext from "@/providers/context";
import { gtagEvent } from "@/helpers";

export const Friends = () => {
  const router = useRouter();
  const { user } = useTelegram();
  const { loading, loadingHandler } = useContext(AppContext);
  const [modal, setModal] = useState(false);
  const [points, setPoints] = useState(0);
  const [invites, setInvites] = useState(0);
  const [friends, setFriends] = useState<FriendProps[]>([]);
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    loadingHandler(true);
    if (user) {
      const token = sessionStorage.getItem("token");
      userAxios
        .get(`/users/${user?.id}/friends`, {
          headers: { ...headers, Authorization: token },
        })
        .then((res) => {
          const {
            data: { referralPoints, invitesCounter, friends },
          } = res;
          setFriends(friends);
          setPoints(referralPoints);
          setInvites(invitesCounter);

          userAxios
            .get(`/users/${user?.id}/referral`, {
              headers: { ...headers, Authorization: token },
            })
            .then((res) => {
              const {
                data: { referralCode },
              } = res;
              setReferralLink(referralCode);
            });
        })
        .catch((error) => {
          router.replace("/");
        })
        .finally(() => {
          loadingHandler(false);
        });
    }
  }, [user]);

  if (loading) return null;

  return (
    <>
      <div className={styles.friends}>
        <h3 className={styles.friends__title}>Invite Friend</h3>
        <p>
          Share the link and get 20% of their points, plus 5% of their friends
          points.
        </p>
        <Spacer space={20} />
        <Board
          icon="/icons/coin-star-icon-white.svg"
          text={`+${points} JPP`}
          title="Total Earned Referal Points"
        />
        <Spacer space={30} />
        <h5>{friends.length} Friends</h5>
        <Spacer space={15} />
        <div className={styles.friends__list}>
          {friends.length > 0 &&
            friends.map((friend) => {
              const { telegramId, avatarLink, username, jupbotPoints, level } =
                friend;
              return (
                <Board
                  key={telegramId}
                  avatar={avatarLink}
                  title={username}
                  value={`${jupbotPoints} JPP`}
                />
              );
            })}
        </div>
      </div>
      <div className={styles.friends__actions}>
        <Button
          type="large"
          variant="filled"
          color={cssVariables.green}
          onClick={() => setModal(true)}
        >
          Invite Friends
        </Button>
      </div>
      <Modal show={modal} closeHandler={() => setModal(false)}>
        <div className={styles.friends__modal_header}>
          <h3>Invite Friends</h3>
        </div>
        <div className={styles.friends__modal_body}>
          <Button
            type="large"
            variant="outlined"
            color={cssVariables.green}
            onClick={() => {
              setModal(false);
              gtagEvent({
                action: "click",
                category: "button",
                label: "send_invite",
                value: 1,
              });
            }}
          >
            <Link
              href={`https://t.me/share/url?url=${referralLink}&text=💸 Trade and earn with JUP bot!.`}
              target="_blank"
            >
              Share
            </Link>
            Send Invite
          </Button>

          <CopyToClipboard
            text={referralLink}
            onCopy={() => {
              toast.success("Referal link is copied!", {
                id: "copied",
              });
            }}
          >
            <Button type="large" variant="outlined" color={cssVariables.green}>
              Copy Link
            </Button>
          </CopyToClipboard>
          <Button
            variant="text"
            type="small"
            color={cssVariables.gray40}
            onClick={() => {
              setModal(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};
