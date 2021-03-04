export const scrollToTop = (id: string | undefined) => {
  if (id) {
    const elem = document.getElementById(id);

    elem?.scroll(0, 0);
  }
};
