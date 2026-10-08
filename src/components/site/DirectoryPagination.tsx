import Link from "next/link";

export function directoryPage(value: string | undefined) { const page = Number(value); return Number.isInteger(page) && page > 0 ? page : 1; }
export function pagedItems<T>(items: T[], page: number, pageSize = 12) { const totalPages = Math.max(1, Math.ceil(items.length / pageSize)); const currentPage = Math.min(page, totalPages); return { items: items.slice((currentPage - 1) * pageSize, currentPage * pageSize), currentPage, totalPages, pageSize }; }
export function DirectoryPagination({ pathname, query, page, total, pageSize }: { pathname: string; query?: string; page: number; total: number; pageSize: number }) {
  if (total <= pageSize) return null;
  const totalPages = Math.ceil(total / pageSize); const href = (nextPage: number) => `${pathname}?${new URLSearchParams({ ...(query ? { q: query } : {}), page: String(nextPage) }).toString()}`;
  return <nav className="card-pagination" aria-label="Directory pages"><span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</span>{page > 1 ? <Link href={href(page - 1)}>← Previous</Link> : <span>← Previous</span>}<span>{page} of {totalPages}</span>{page < totalPages ? <Link href={href(page + 1)}>Next →</Link> : <span>Next →</span>}</nav>;
}
