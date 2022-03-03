import { detect, dragdrop } from './imagehelper.js'

$(function () {
  dragdrop();

  function preparedata (file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    detect(img.src, function (result) {
      let winWidth = $(window).width();
      let imgWidth = result.imgWidth;
      let imgHeight = result.imgHeight;
      let data = { 'winWidth': winWidth, 'imgWidth': imgWidth, 'imgHeight': imgHeight };
      let jdata = JSON.stringify(data);
      let fd = new FormData();
      fd.append('imgdata', jdata);
      fd.append('file', file);
      uploadData(fd);
    });
  }

  // Drop
  $('.upload-area').on('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $("#howto").text("We are uploading your file.");
    let file = e.originalEvent.dataTransfer.files;
    let imageType = /image.*/;
    let winWidth = $("#window_width").val();
    let dropped = file[0];
    if (dropped.type.match(imageType)) {
      preparedata(dropped);
    } else {
      $("#howto").text("Please use an image file. Try one more time.");
    }
  });

  // Open file selector on div click
  $("#uploadfile").click(function () {
    $("#file").click();
  });

  // file selected
  $("#file").change(function () {
    let imageType = /image.*/;
    let file = $('#file')[0].files[0];
    $("#howto").text("Uploading your file.");
    if (file.type.match(imageType)) {
      preparedata(file);
    } else {
      $("#howto").text("Please use an image file. Try one more time.");
    }
  });
});



$(function () {
  dragdrop();

  function preparedata_style (file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    detect(img.src, function (result) {
      let winWidth = $(window).width();
      let imgWidth = result.imgWidth;
      let imgHeight = result.imgHeight;
      let data = { 'winWidth': winWidth, 'imgWidth': imgWidth, 'imgHeight': imgHeight };
      let jdata = JSON.stringify(data);
      let fd = new FormData();
      fd.append('imgdata', jdata);
      fd.append('file', file);
      uploadData_style(fd);
    });
  }

  // Drop
  $('.upload-area').on('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $("#howto").text("We are uploading your file.");
    let file = e.originalEvent.dataTransfer.files;
    let imageType = /image.*/;
    let winWidth = $("#window_width").val();
    let dropped = file[0];
    if (dropped.type.match(imageType)) {
      preparedata_style(dropped);
    } else {
      $("#howto").text("Please use an image file. Try one more time.");
    }
  });

  // Open file selector on div click
  $("#uploadfile_style").click(function () {
    $("#file_style").click();
  });

  // file selected
  $("#file_style").change(function () {
    let imageType = /image.*/;
    let file = $('#file_style')[0].files[0];
    $("#howto").text("Uploading your file.");
    if (file.type.match(imageType)) {
      preparedata_style(file);
    } else {
      $("#howto").text("Please use an image file. Try one more time.");
    }
  });
});

// Sending AJAX request and upload file
function uploadData (formdata) {
  console.log(formdata)

  $.ajax({
    url: '/upload/new/',
    type: 'post',
    data: formdata,
    contentType: false,
    processData: false,
    success: function (data) {
      updatetags(data);
    }
  });
}

function updatetags (data) {
  console.log(data)
  let original = `<img src="/${data.thumb_path}" class="responsive" alt="" id="origin_img">`;
  $("#original").html(original);

  $("#howto").html("Drag and Drop file here<br />Or<br />Click to Upload")
}


// Sending AJAX request and upload file
function uploadData_style (formdata) {

  $.ajax({
    url: '/upload/new/',
    type: 'post',
    data: formdata,
    contentType: false,
    processData: false,
    success: function (data) {
      updatetags_style(data);
    }
  });
}

function updatetags_style (data) {
  let original = `<img src="/${data.thumb_path}" class="responsive" alt="" id="style_img">`;
  $("#original_style").html(original);

  $("#howto").html("Drag and Drop file here<br />Or<br />Click to Upload")
}


$('#result_transfer').on("click", function() {
  let original_image = document.getElementById('origin_img').src.replace('http://0.0.0.0:8080/', '');
  let style_image = document.getElementById('style_img').src.replace('http://0.0.0.0:8080/', '');
  fetch("/style_transfer?original_path="+original_image+"&style_path="+style_image)
    .then((res) => {
        return res.json(); //Promise 반환
    })
    .then((json) => {
        update_result_src(json); // 서버에서 주는 json데이터가 출력 됨
    });
})


function update_result_src (data) {
  console.log(data)
  let original = `<img src="/${data.result}" class="responsive" alt="" id="result_img">`;
  $("#result_original_image").html(original);
}
