
interface OpenBookProps {
    /**
     * Classname for the icon
     */
    classname: string;
}
const OpenBook = ({ classname }:OpenBookProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={classname}
    >
      <path
        stroke="#1D9089"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 5h7c1.1046 0 2 .89543 2 2v12H3V5Zm9 2c0-1.10457.8954-2 2-2h7v14h-9V7Zm0 0v13"
      />
      <path
        fill="#1D9089"
        fillRule="evenodd"
        d="M11 20c0 .5523.4477 1 1 1s1-.4477 1-1h8c.5523 0 1-.4477 1-1V5c0-.55228-.4477-1-1-1h-7c-.7684 0-1.4692.28885-2 .7639C11.4692 4.28885 10.7684 4 10 4H3c-.55228 0-1 .44772-1 1v14c0 .5523.44771 1 1 1h8ZM4 6v12h7V7c0-.55228-.4477-1-1-1H4Zm9 1v11h7V6h-6c-.5523 0-1 .44772-1 1Z"
        clipRule="evenodd"
      />
    </svg>
  );
};
export const OpenBookIcon = OpenBook;
