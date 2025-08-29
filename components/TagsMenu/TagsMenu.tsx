"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Tag } from "@/types/note";
import css from "./TagsMenu.module.css";

interface TagsMenuProps {
  allTags: Tag[];
}

const TagsMenu = ({ allTags }: TagsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const uniqueTags = useMemo(
    () => Array.from(new Set(allTags)),
    [allTags]
  );

  const currentTag: Tag = useMemo(() => {
    const m = pathname.match(/^\/notes(?:\/filter\/([^/?#]+))?/);
    return (m?.[1] as Tag) ?? "All";
  }, [pathname]);

  const isAllActive = pathname === "/notes" || currentTag === "All";

  const toggleOpen = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className={css.menuContainer} ref={menuRef}>
      <button
        type="button"
        className={css.menuButton}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggleOpen}
      >
        Filter by tag
      </button>

      {isOpen && (
        <ul className={css.menuList} role="menu">
          {/* All notes */}
          <li role="none">
            <Link
              href="/notes/filter/All"
              role="menuitem"
              className={`${css.menuLink} ${isAllActive ? css.active : ""}`}
              onClick={close}
            >
              All notes
            </Link>
          </li>

          {/* Інші теги (без дублювання All) */}
          {uniqueTags
            .filter((t): t is Tag => Boolean(t) && t !== "All")
            .map((tag) => (
              <li key={tag} role="none">
                <Link
                  href={`/notes/filter/${encodeURIComponent(tag)}`}
                  role="menuitem"
                  className={`${css.menuLink} ${
                    currentTag === tag ? css.active : ""
                  }`}
                  onClick={close}
                >
                  {tag}
                </Link>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
