const rootStyles = window.getComputedStyle(document.documentElement);

if (
  rootStyles.getPropertyValue("--tractor-picture-width-large") != null &&
  rootStyles.getPropertyValue("--tractor-picture-width-large") !== ""
) {
  ready();
} else {
  document.getElementById("main-css").addEventListener("load", ready);
}

function ready() {
  const pictureWidth = parseFloat(
    rootStyles.getPropertyValue("--tractor-picture-width-large")
  );
  const pictureAspectRatio = parseFloat(
    rootStyles.getPropertyValue("--tractor-picture-aspect-ratio")
  );
  const pictureHeight = pictureWidth / pictureAspectRatio;
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
  );

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / pictureAspectRatio,
    imageResizeTargetWidth: pictureWidth,
    imageResizeTargetHeight: pictureHeight,
  });

  FilePond.parse(document.body);
}
