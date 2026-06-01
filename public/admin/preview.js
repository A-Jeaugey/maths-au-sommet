/* Aperçu en direct (Decap CMS) pour la collection "pages".
 *
 * Au lieu de re-dessiner le site, on affiche LA VRAIE PAGE dans une iframe
 * (/admin-preview) et on lui envoie le contenu en cours d'édition via
 * postMessage. L'aperçu est donc le site lui-même : mêmes composants, même
 * CSS, mêmes fins traits (contour lines) et mêmes animations — fidélité 100 %
 * et zéro maintenance.
 */
(function () {
  var PagePreview = createClass({
    post: function () {
      try {
        if (!this._frame || !this._frame.contentWindow) return;
        var data = this.props.entry.get("data");
        this._frame.contentWindow.postMessage(
          { __cmsPreview: true, payload: data ? data.toJS() : {} },
          "*"
        );
      } catch (e) {
        /* iframe pas encore prête : un prochain post() prendra le relais */
      }
    },
    componentDidUpdate: function () {
      this.post();
    },
    render: function () {
      var self = this;
      return h("iframe", {
        src: "/admin-preview",
        title: "Aperçu de la page",
        ref: function (el) {
          self._frame = el;
        },
        onLoad: function () {
          // Plusieurs envois pour gagner la course avec le montage React de l'iframe.
          self.post();
          setTimeout(function () { self.post(); }, 300);
          setTimeout(function () { self.post(); }, 1200);
        },
        style: {
          width: "100%",
          height: "100vh",
          border: "0",
          display: "block",
          background: "#F8F9FB",
        },
      });
    },
  });

  if (window.CMS) {
    CMS.registerPreviewTemplate("pages", PagePreview);
  }
})();
