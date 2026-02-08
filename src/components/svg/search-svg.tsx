export default function SearchSvg({ clr = "currentColor" }: { clr?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.22221 13.4444C10.6586 13.4444 13.4444 10.6586 13.4444 7.22221C13.4444 3.78578 10.6586 1 7.22221 1C3.78578 1 1 3.78578 1 7.22221C1 10.6586 3.78578 13.4444 7.22221 13.4444Z"
        stroke={clr}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.0004 15L11.6171 11.6167"
        stroke={clr}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchSvgTwo({clr="currentColor"}:{clr?:string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M13.4 13.4L17 17"
        stroke={clr}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.4 8.19999C15.4 4.22354 12.1765 1 8.20001 1C4.22357 1 1.00002 4.22354 1.00002 8.19999C1.00002 12.1764 4.22357 15.4 8.20001 15.4C12.1765 15.4 15.4 12.1764 15.4 8.19999Z"
        stroke={clr}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchSvgThree() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M14.9493 14.95L18.9993 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.2 9.09999C17.2 4.62649 13.5735 1 9.10005 1C4.62655 1 1.00006 4.62649 1.00006 9.09999C1.00006 13.5735 4.62655 17.2 9.10005 17.2C13.5735 17.2 17.2 13.5735 17.2 9.09999Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
