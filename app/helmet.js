module.exports = {
  link: [
    {rel: "icon", href: "/images/favicon.ico?v=2"}
  ],
  meta: [
    {charset: "utf-8"},
    {"http-equiv": "X-UA-Compatible", "content": "IE=edge"},
    {name: "description", content: "Visualizing the open data landscape of Africa."},
    {name: "viewport", content: "width=device-width, initial-scale=1"},
    {name: "mobile-web-app-capable", content: "yes"},
    {name: "apple-mobile-web-app-capable", content: "yes"},
    {name: "apple-mobile-web-app-status-bar-style", content: "black"},
    {name: "apple-mobile-web-app-title", content: "Data Africa"},
    {property: "og:title", content: "Data Africa"},
    {property: "og:type", content: "article"},
    {property: "og:image", content: "/images/africa-share.jpg"},
    {property: "og:description", content: "{{ meta_desc }}"}
  ],
  title: "Data Africa"
};
