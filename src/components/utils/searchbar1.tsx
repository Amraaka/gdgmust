import { IoSearch } from "react-icons/io5";
import { useTranslations } from "next-intl";

export default function SearchBar() {
  const t = useTranslations();
  return (
    <div className="relative lg:w-[345px] w-[320px] md:w-[345px] select-none"
    draggable="false">
      <div className="flex items-center relative h-[46px] w-full bg-white rounded-full border border-black px-1">
        <input
          type="text"
          placeholder={t('CommunityPage.SearchBar.text')}
          className="flex-grow ml-2 mb-[2px] h-full bg-transparent outline-none text-base placeholder-zinc-300 select-none"
        />
        <div className="flex items-center justify-center bg-zinc-300 w-9 h-9 rounded-full">
          <IoSearch className="text-black w-5 h-5" />
        </div>
      </div>
    </div>
  );
}