const ContactSticky = () => {
  return (
    <div
      className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2
         flex-col gap-3"
    >
      <a
        href="tel:0123456789"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full "
      >
        <img
          src="/image/IconPhone.png"
          alt="Call"
          className="h-50 w-50 object-contain"
        />
      </a>
      <a
        href="https://m.me/yourpage"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full "
      >
        <img
          src="/image/IconZalo.png"
          alt="Call"
          className="h-50 w-50 object-contain"
        />
      </a>
      <a
        href="https://m.me/yourpage"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full "
      >
        <img
         src="/image/IconMessage.png"
          alt="Call"
          className="h-50 w-50 object-contain"
        />
      </a>
      <a
        href="https://m.me/yourpage"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full "
      >
        <img
         src="/image/FrameIcon.png"
          alt="Call"
          className="h-50 w-50 object-contain"
        />
      </a>
    </div>
  );
};
export default ContactSticky;
