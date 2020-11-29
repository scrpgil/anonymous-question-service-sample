export function sayHello() {
  return Math.random() < 0.5 ? 'Hello' : 'Hola';
}

export const getTwitterLink = (path: string) => {
  const link = "https://" + location.host + path;
  return "https://twitter.com/intent/tweet?url=" + encodeURIComponent(link);
};