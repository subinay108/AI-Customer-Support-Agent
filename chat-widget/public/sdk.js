window.SupportAI = {
  init: function (config) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://127.0.0.1:5173/widget?companyId=${config.companyId}&type=${config.type}`;
    iframe.style.position = "fixed";
    iframe.style.bottom = "20px";
    iframe.style.right = "20px";
    iframe.style.width = "400px";
    iframe.style.height = "600px";
    iframe.style.border = "none";
    iframe.style.borderRadius = "12px";
    document.body.appendChild(iframe);
  }
};
