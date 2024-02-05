const ChatBox = ({className}: {className?: string}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={className}>
      <path
        stroke="#1D9089"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 6c0-.55228-.4477-1-1-1H4c-.55228 0-1 .44772-1 1v12c0 .5523.44772 1 1 1h.97524c-.02363.4216-.06205.7316-.10637.9572-.04753.2418-.09362.3421-.10541.3664-.26229.2855-.33668.6986-.18734 1.0591.15478.3737.51942.6173.92388.6173 2.30126 0 3.54058-1.5318 4.18584-3H20c.5523 0 1-.4477 1-1V6Z"
      />
    </svg>
  )
}
export const ChatBoxIcon = ChatBox
