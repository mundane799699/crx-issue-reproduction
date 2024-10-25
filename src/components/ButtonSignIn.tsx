type ButtonSignInProps = {
  user?: any;
  className?: string;
};

const ButtonSignIn = ({ user, className }: ButtonSignInProps) => {
  return user ? (
    <button className={`flex items-center space-x-2 ${className}`}>
      {user?.user_metadata?.avatar_url ? (
        <img
          src={user?.user_metadata?.avatar_url}
          alt={user?.user_metadata?.name || "Account"}
          className="w-6 h-6 rounded-full shrink-0"
          referrerPolicy="no-referrer"
          width={24}
          height={24}
        />
      ) : (
        <span className="w-6 h-6 bg-base-300 flex justify-center items-center rounded-full shrink-0">
          {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0)}
        </span>
      )}
      <span>{user?.user_metadata?.name || user?.email || "Account"}</span>
    </button>
  ) : (
    <a
      href={`${import.meta.env.VITE_BASE_HOST}/signin`}
      target="_blank"
      className={className}
    >
      Sign In
    </a>
  );
};

export default ButtonSignIn;
