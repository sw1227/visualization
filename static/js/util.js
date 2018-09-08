// Draw square image based on pixel array and color interpolater
function imshow(elementId, pixels, interpolate=d3.interpolateViridis) {
    var element = document.getElementById(elementId);
    var size = Math.sqrt(pixels.length);
    element.setAttribute("width", size);
    element.setAttribute("height", size);
    var context = element.getContext("2d");
    var imageData = context.createImageData(size, size);

    pixels.forEach((d, i) => {
        var color = isNaN(d) ? {"r": 0, "g": 0, "b": 0} : d3.color(interpolate(d));
        imageData.data[i*4  ] = color.r;
        imageData.data[i*4+1] = color.g;
        imageData.data[i*4+2] = color.b;
        imageData.data[i*4+3] = 255;
    });
    context.putImageData(imageData, 0, 0);
}
