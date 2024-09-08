"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent, useContext } from "react";
import { useTelegram } from "@/providers/telegram";
import AppContext from "@/providers/context";
import { CropperBox, PhotoUploader, Spacer, Button } from "@/components";
import { useDebounce } from "@/hooks";
import styles from "./style.module.scss";
import { readFile } from "@/helpers";
import { cssVariables } from "@/assets/styles/variables";
import { avatarStubBase64 } from "@/assets/data";
import { userAxios, headers } from "@/api";
import { checkImageFileType } from "@/helpers";
import toast from "react-hot-toast";

export const Profile = () => {
  const { loadingHandler } = useContext(AppContext);
  const router = useRouter();
  const { user } = useTelegram();
  const [modal, setModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState<Blob>();
  const [croppedImageSrc, setCroppedImageSrc] = useState("");
  const [event, setEvent] = useState<React.ChangeEvent<HTMLInputElement>>();
  const [nickname, setNickname] = useState("");
  const debouncedNikname = useDebounce(nickname, 500);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessTextText] = useState("");

  const onFileChange = async (e: any) => {
    const imageTypes = ["jpg", "jpeg", "png", "webp", "ico"];
    const limitSize = 5242880;

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!checkImageFileType(file.type.toLowerCase(), imageTypes)) {
        toast.error("Image file must be jpg, jpeg, png, webp or ico", {
          id: "imageType",
        });
      } else if (file.size > limitSize) {
        toast.error("File size must be max 5mb", {
          id: "imageSize",
        });
      } else {
        setImageFile(file);
        let imageDataUrl = await readFile(file);
        setImageSrc(imageDataUrl as any);
        setEvent(e);
        setModal(true);
      }
    }
  };

  const handdleCroppedImage = (url: string) => {
    setCroppedImageSrc(url);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (nickname.length >= 3 && nickname.length <= 15) {
      userAxios
        .get(`/users/verify/username/${nickname}`, {
          headers: {
            ...headers,
            "Authorization": token,
          },
        })
        .then((response) => {
          const {
            data: { usernameExists },
          } = response;
          if (usernameExists) {
            setSuccessTextText("");
            setError(true);
            setErrorText("Unfortunately, the username is already taken");
          } else {
            setSuccessTextText("Great choice! That username is available");
            setError(false);
            setErrorText("");
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [debouncedNikname]);

  const handleNickname = (value: string) => {
    setErrorText("");
    setError(true);
    const rex = /^[A-Za-z0-9 ]+$/;
    if (rex.test(value)) {
      setNickname(value);
    }
    if (value === "") setNickname("");
    if (value.length < 3 || value.length > 15) {
      setSuccessTextText("");
      setError(true);
      setErrorText(
        "Nikname length must be more than 3 and less than 15 symbols"
      );
    }
  };

  useEffect(() => {}, [imageSrc, croppedImageSrc]);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loadingHandler(true);
    const token = sessionStorage.getItem("token");
    const data = {
      username: nickname,
      telegramId: String(user?.id),
      avatar: avatarStubBase64,
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile as Blob);
      reader.onload = function () {
        const base64 = reader.result;
        data.avatar = base64 as string;
        userAxios
          .post("/users", data, {
            headers: {
              ...headers,
              "Authorization": token,
            },
          })
          .then((response) => {
            const { status } = response;
            if (status === 200) router.replace("/");
          })
          .finally(() => loadingHandler(false));
      };
    } else {
      userAxios
        .post("/users", data, {
          headers: {
            ...headers,
            "Authorization": token,
          },
        })
        .then((response) => {
          console.log(response);

          const { status } = response;
          if (status === 200) router.replace("/");
        })
        .finally(() => loadingHandler(false));
    }
  };

  return (
    <>
      <div className={styles.profile}>
        <form onSubmit={submitHandler} autoComplete="off">
          <input
            type="hidden"
            name="avatar"
            value={
              croppedImageSrc ? croppedImageSrc : "/images/avatar-stub.webp"
            }
          />
          <PhotoUploader
            url={croppedImageSrc}
            callBack={(e) => onFileChange(e)}
          />
          <div
            className={`form-control ${error ? "error" : ""} ${
              successText.length > 0 ? "success" : ""
            }`}
          >
            <label htmlFor="nickname">Nickname</label>
            <input
              id="nickname"
              type="text"
              name="nickname"
              value={nickname}
              onChange={(e) => handleNickname(e.target.value)}
            />
            {error && <span>{errorText}</span>}
            {successText.length > 0 && <span>{successText}</span>}
          </div>
          <Button
            className={styles.profile__submit}
            type="large"
            variant="filled"
            color={cssVariables.green}
            disabled={error || nickname.length === 0}
            submit
          >
            {/* <Link href="/check-in">link</Link> */}
            Continue
          </Button>
        </form>
      </div>
      <div
        className={`${styles.profile__modal} ${
          modal ? styles.profile__modal_show : ""
        }`}
      >
        {imageSrc && (
          <>
            <Spacer space={16} />
            <h3>Crop Your Avatar</h3>
            <Spacer space={16} />
            <CropperBox
              event={event}
              applyHandler={handdleCroppedImage}
              cancelHandler={() => setModal(false)}
              changeHandler={(e) => onFileChange(e)}
            />
          </>
        )}
      </div>
    </>
  );
};
