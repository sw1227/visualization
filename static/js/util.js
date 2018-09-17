// Draw square image based on pixel array and color interpolater
function imshow(elementId, array, size, interpolate=d3.interpolateViridis) {
    var parent = d3.select(`#${elementId}`)
        .attr("class", "card")
        .attr("style", `width: ${size}px; height: ${size}px;`);
    var canvas = parent.select("canvas")
    canvas = canvas.empty() ? parent.append("canvas").attr("class", "card-img") : canvas;

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


// Generate Dropdown given each item's text and callback
function generateDropdown(data, parentId, name) {
    var dropdown = d3.select(`#${parentId}`).append("div")
        .attr("class", "dropdown");

    dropdown.append("button")
        .attr("class", "btn btn-primary dropdown-toggle")
        .attr("id", `dropdown-${name}`)
        .attr("type", "button")
        .attr("data-toggle", "dropdown")
        .attr("aria-haspopup", "true")
        .attr("aria-expanded", "false")
        .text(name);

    dropdown.append("div")
        .attr("class", "dropdown-menu")
        .attr("aria-labelledby", `dropdown-${name}`)
      .selectAll("a").data(data).enter().append("a")
        .attr("class", "dropdown-item")
        .attr("onclick", d => d.callback)
        .text(d => d.text);
}


// Generate Sliders for parameters
function generateSlider(params, parentId, callbackStr) {
    var div = d3.select(`#${parentId}`)
        .selectAll("div")
        .data(Object.entries(params).map(p => ({"name": p[0], "value": p[1]})))
      .enter().append("div")
        .attr("align", "center")
        .attr("id", d => d.name);
    var callback = part => (
        d => (
            `params.${d.name}.${part}=parseFloat(this.value);` +
            `d3.select('#${d.name}').select('.value').text(params.${d.name}.toString());` +
            callbackStr
        )
    );
    // Show value
    div.append("div")
        .text(d => `${d.name} = `)
      .append("span")
        .attr("class", "value")
        .text(d => d.value.toString());
    // Real part
    div.append("div")
        .text("Re: ")
      .append("input")
        .attr("type", "range").attr("class", "slider").attr("style", "vertical-align: middle;")
        .attr("min", "-1").attr("max", "1").attr("step", "0.05")
        .attr("value", d => d.value.re)
        .attr("oninput", callback("re"));
    // Imaginary part
    div.append("div")
        .text("Im: ")
      .append("input")
        .attr("type", "range").attr("class", "slider").attr("style", "vertical-align: middle;")
        .attr("min", "-1").attr("max", "1").attr("step", "0.05")
        .attr("value", d => d.value.im)
        .attr("oninput", callback("im"));
    div.append("br");
}


// Calculate proximity to lattice
function latticeProximity(x, y, alpha=0.01) {
    // alpha: prevent divergence of log - the smaller the sharper
    var dx = - Math.log(alpha + Math.abs(x - Math.round(x)));
    var dy = - Math.log(alpha + Math.abs(y - Math.round(y)));
    // Normalize
    const minVal = - 2 * Math.log(alpha + 0.5);
    const maxVal = - 2 * Math.log(alpha);
    return (dx + dy - minVal) / (maxVal - minVal); // range [0, 1]
}


// (x, y) => 0 or 1
function checkerBoard(x, y) {
    return Math.abs(Math.abs(Math.floor(x) % 2) - Math.abs(Math.floor(y) % 2))
}


// (x, y) => Argument(angle) [-Pi, +PI] => [0, 2*PI] => [0, 1]
function normalizedArg(x, y) {
    return (math.atan2(y, x) + 2*Math.PI) % (2*Math.PI) / (2*Math.PI);
}
