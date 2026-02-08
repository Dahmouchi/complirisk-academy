export function GridSvg({clr="currentColor"}: {clr?: string}) {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.66667 1H1V5.66667H5.66667V1Z" stroke={clr} strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M12.9997 1H8.33301V5.66667H12.9997V1Z" stroke={clr} strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M12.9997 8.33337H8.33301V13H12.9997V8.33337Z" stroke={clr} strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M5.66667 8.33337H1V13H5.66667V8.33337Z" stroke={clr} strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
    )
}
export function ListSvg({clr="currentColor"}: {clr?: string}) {
    return (
        <svg width="14" height="14" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 7.11108H1" stroke={clr} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M15 1H1" stroke={clr} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M15 13.2222H1" stroke={clr} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
    )
}

export function FilterSvg() {
    return (
        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.9998 3.44995H10.7998" stroke="#5169F1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.8 3.44995H1" stroke="#5169F1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.60039 5.9C7.95349 5.9 9.05039 4.8031 9.05039 3.45C9.05039 2.0969 7.95349 1 6.60039 1C5.24729 1 4.15039 2.0969 4.15039 3.45C4.15039 4.8031 5.24729 5.9 6.60039 5.9Z" stroke="#5169F1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.0002 11.15H12.2002" stroke="#5169F1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.2 11.15H1" stroke="#5169F1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.4002 13.6C10.7533 13.6 11.8502 12.503 11.8502 11.15C11.8502 9.79685 10.7533 8.69995 9.4002 8.69995C8.0471 8.69995 6.9502 9.79685 6.9502 11.15C6.9502 12.503 8.0471 13.6 9.4002 13.6Z" stroke="#5169F1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}