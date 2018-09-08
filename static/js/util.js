// Draw square image based on pixel array and color interpolater
function imshow(elementId, array, size, interpolate=d3.interpolateViridis) {
    var parent = d3.select(`#${elementId}`)
	.attr("class", "card")
	.attr("style", `width: ${size}px; height: ${size}px;`);
    var canvas = parent.append("canvas")
	.attr("class", "card-img");

    var resolution = Math.sqrt(array.length);
    canvas.attr("width", resolution).attr("height", resolution);

    var context = canvas.node().getContext("2d");
    var imageData = context.createImageData(resolution, resolution);

    array.forEach((d, i) => {
        var color = isNaN(d) ? {"r": 0, "g": 0, "b": 0} : d3.color(interpolate(d));
        imageData.data[i*4  ] = color.r;
        imageData.data[i*4+1] = color.g;
        imageData.data[i*4+2] = color.b;
        imageData.data[i*4+3] = 255;
    });
    context.putImageData(imageData, 0, 0);
}
