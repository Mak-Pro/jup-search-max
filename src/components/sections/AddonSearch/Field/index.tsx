"use client";
import Image from "next/image";
import { useState, useEffect, FocusEvent, useRef } from "react";
import styles from "./style.module.scss";

export const SearchField = ({
  callBack,
}: {
  callBack: (value: string) => void;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchValue.length === 43 || searchValue.length === 44) {
      callBack(searchValue);
    }
  }, [searchValue]);

  const eventScroll = (e)=>{
    e.preventDefault();
    e.stopPropagation()
    inputRef.current.scrollIntoView();
  };

  const handleFocusBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (
      inputRef &&
      inputRef.current !== null &&
      inputRef.current.value === ""
    ) {
      if (e.type === "focus") {
        document.querySelector("main")?.classList.add("search-active");
        document
          .querySelector(".search-box")
          ?.classList.add("search-box-active");

        document
          .querySelector(".search-title")
          ?.classList.add("search-title-active");

        if(window){
          window.addEventListener('scroll', eventScroll);
        }
      }
      if (e.type === "blur") {
        if(window){
          window.removeEventListener('scroll', eventScroll);
        }
        document.querySelector("main")?.classList.remove("search-active");
        document
          .querySelector(".search-box")
          ?.classList.remove("search-box-active");

        document
          .querySelector(".search-title")
          ?.classList.remove("search-title-active");
      }
    }
  };

  return (
    <>
      <div className={`${styles.search} search-title`}>
        <h3 className={styles.search__title}>Search</h3>
      </div>
      <div className={`${styles.search__action_box} search-box`}>
        <h6 className={styles.search__action_title}>
          To buy a token enter a token address
        </h6>
        <div className={styles.search__action_field}>
          <Image
            src="/icons/addon-search-icon.svg"
            width={20}
            height={20}
            alt="search"
          />
          <input
            type="text"
            placeholder="Type or paste address herse"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={(e) => handleFocusBlur(e)}
            onBlur={(e) => handleFocusBlur(e)}
            ref={inputRef}
          />
        </div>
      </div>
    </>
  );
};
