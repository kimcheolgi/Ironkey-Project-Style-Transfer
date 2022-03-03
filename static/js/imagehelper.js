function detect (URL, callback) {
  let imgWidth;
  let imgHeight;
  let image = new Image();
  image.src = URL;
  image.onload = function () {
    imgWidth = this.width;
    imgHeight = this.height;
    callback({ imgWidth, imgHeight });
  };
}

function dragdrop () {
  // preventing page from redirecting
  $("html").on("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $("#howto").text("Drag here");
  });

  $("html").on("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  // Drag enter
  $('.upload-area').on('dragenter', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $("#howto").text("Drop");
  });

  // Drag over
  $('.upload-area').on('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $("#howto").text("Drop");
  });
}

export { detect, dragdrop }