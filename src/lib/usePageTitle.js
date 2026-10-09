import { useEffect } from 'react'

const CLUB = 'VFC Arts, Sports & Welfare Club'

/** Names the browser tab after the page, so history and bookmarks make sense. */
export function usePageTitle(page) {
  useEffect(() => {
    document.title = page ? `${page} | ${CLUB}` : CLUB
  }, [page])
}
