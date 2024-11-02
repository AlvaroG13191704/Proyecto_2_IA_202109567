// global variable
let xTrain = [];
let yTrain = [];
let yPredict = [];
let model;

function loadFile(callback) {
  // get file
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, seleccione un archivo");
    return;
  }

  // read file
  const reader = new FileReader();
  reader.onload = function (event) {
    const data = event.target.result;
    processFile(data);

    if (callback) {
      callback();
    }
  };

  reader.readAsText(file);
}

// function to print the logs of the file read
function processFile(data) {
  const rows = data.split("\n");
  xTrain = [];
  yTrain = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(",");
    if (row.length === 2) {
      xTrain.push(parseFloat(row[0]));
      yTrain.push(parseFloat(row[1]));
    }
  }
}

// Button functions
function trainModel() {
  document.getElementById("log").innerHTML = "Entrenando modelo...";

  // get the model selected
  const modelSelected = document.getElementById("algorithmSelect").value;
  if (modelSelected === "linear_regression") {
    loadFile(function () {
      // USE THE LINEAR REGRESSION MODEL
      model = new LinearRegression();

      model.fit(xTrain, yTrain);

      document.getElementById("log").innerHTML +=
        "<br>Modelo de Regresión Lineal entrenado.<br>X Train: " +
        xTrain +
        "<br>Y Train: " +
        yTrain;
    });
  } else if (modelSelected === "polynomial_regression") {
    const degree = document.getElementById("grade").value;

    loadFile(function () {
      // USE THE POLYNOMIAL REGRESSION MODEL
      console.log("Polynomial Regression");
      console.log("X Train: ", xTrain);
      console.log("Y Train: ", yTrain);

      model = new PolynomialRegression();

      model.fit(xTrain, yTrain, parseFloat(degree));

      document.getElementById("log").innerHTML +=
        "<br>Modelo de Regresión Polinomial entrenado.<br>X Train: " +
        xTrain +
        "<br>Y Train: " +
        yTrain +
        "<br>Grado: " +
        degree +
        "<br>Soluciones: " +
        JSON.stringify(model.solutions.join(", "));
    });
  } else {
    document.getElementById("log").innerHTML += "<br>Modelo no seleccionado";
  }
}

// predict model
function predictModel() {
  const modelSelected = document.getElementById("algorithmSelect").value;

  if (model && modelSelected === "linear_regression") {
    yPredict = model.predict(xTrain);
    document.getElementById("results_div").innerHTML =
      "<br>Predicciones Y: " + yPredict;
  } else if (model && modelSelected === "polynomial_regression") {
    yPredict = model.predict(xTrain);
    document.getElementById("results_div").innerHTML =
      "<br>Predicciones Y: " + yPredict;
  }
}

function showGraph() {
  const modelSelected = document.getElementById("algorithmSelect").value;

  if (yPredict.length > 0 && modelSelected === "linear_regression") {
    const dataArray = joinArrays(
      "x",
      xTrain,
      "yTrain",
      yTrain,
      "yPredict",
      yPredict
    );

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => drawChart(dataArray));
  } else if (yPredict.length > 0 && modelSelected === "polynomial_regression") {
    const dataArray = joinArrays(
      "x",
      xTrain,
      "yTrain",
      yTrain,
      "yPredict",
      yPredict
    );

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => drawChart(dataArray));
  } else {
    alert("Primero realiza una predicción para mostrar la gráfica.");
  }
}

function showTrend() {
  const modelSelected = document.getElementById("algorithmSelect").value;

  if (
    xTrain.length > 1 &&
    yTrain.length > 1 &&
    modelSelected === "linear_regression"
  ) {
    const trendData = [];
    for (let i = 0; i < xTrain.length; i++) {
      trendData.push([xTrain[i], yTrain[i]]);
    }

    // Calculate the slope
    const slope =
      (yTrain[yTrain.length - 1] - yTrain[0]) /
      (xTrain[xTrain.length - 1] - xTrain[0]);
    const trendText =
      slope > 0
        ? "La tendencia es ascendente."
        : "La tendencia es descendente.";

    document.getElementById("log").innerHTML += `<br>${trendText}`;

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => drawTrendChart(trendData));
  } else if (
    xTrain.length > 1 &&
    yTrain.length > 1 &&
    modelSelected === "polynomial_regression"
  ) {
    const trendData = [];
    for (let i = 0; i < xTrain.length; i++) {
      trendData.push([xTrain[i], yTrain[i]]);
    }

    // Calculate the slope
    const slope =
      (yTrain[yTrain.length - 1] - yTrain[0]) /
      (xTrain[xTrain.length - 1] - xTrain[0]);
    const trendText =
      slope > 0
        ? "La tendencia es ascendente."
        : "La tendencia es descendente.";

    document.getElementById("log").innerHTML += `<br>${trendText}`;

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => drawTrendChart(trendData));
  } else {
    alert("Primero carga y entrena un modelo con datos suficientes.");
  }
}

function showPatterns() {
  const modelSelected = document.getElementById("algorithmSelect").value;

  if (
    xTrain.length > 1 &&
    yTrain.length > 1 &&
    modelSelected === "linear_regression"
  ) {
    const avgData = xTrain.map((x, index) => [x, yTrain[index]]);

    // Calculate the peaks and valleys
    let peaks = 0,
      valleys = 0;
    for (let i = 1; i < yTrain.length - 1; i++) {
      if (yTrain[i] > yTrain[i - 1] && yTrain[i] > yTrain[i + 1]) peaks++;
      if (yTrain[i] < yTrain[i - 1] && yTrain[i] < yTrain[i + 1]) valleys++;
    }

    const patternText = `Patrones detectados: ${peaks} picos y ${valleys} valles en los datos.`;
    document.getElementById("log").innerHTML += `<br>${patternText}`;

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => drawPatternChart(avgData));
  } else if (
    xTrain.length > 1 &&
    yTrain.length > 1 &&
    modelSelected === "polynomial_regression"
  ) {
    const avgData = xTrain.map((x, index) => [x, yTrain[index]]);

    // Calculate the peaks and valleys
    let peaks = 0,
      valleys = 0;
    for (let i = 1; i < yTrain.length - 1; i++) {
      if (yTrain[i] > yTrain[i - 1] && yTrain[i] > yTrain[i + 1]) peaks++;
      if (yTrain[i] < yTrain[i - 1] && yTrain[i] < yTrain[i + 1]) valleys++;
    }

    const patternText = `Patrones detectados: ${peaks} picos y ${valleys} valles en los datos.`;
    document.getElementById("log").innerHTML += `<br>${patternText}`;

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => drawPatternChart(avgData));
  } else {
    alert("Primero carga y entrena un modelo con datos suficientes.");
  }
}

function drawChart(dataArray) {
  var data = google.visualization.arrayToDataTable(dataArray);
  var options = {
    seriesType: "scatter",
    series: { 1: { type: "line" } },
  };
  var chart = new google.visualization.ComboChart(
    document.getElementById("results_div")
  );
  chart.draw(data, options);
}

function drawTrendChart(dataArray) {
  const data = google.visualization.arrayToDataTable([
    ["X", "Y"],
    ...dataArray,
  ]);
  const options = {
    title: "Tendencia de los datos",
    trendlines: { 0: {} },
    legend: { position: "bottom" },
  };
  const chart = new google.visualization.LineChart(
    document.getElementById("results_div")
  );
  chart.draw(data, options);
}

function drawPatternChart(dataArray) {
  const data = google.visualization.arrayToDataTable([
    ["X", "Y"],
    ...dataArray,
  ]);
  const options = {
    title: "Patrones en los datos",
    hAxis: { title: "X" },
    vAxis: { title: "Y" },
    legend: "none",
  };
  const chart = new google.visualization.ColumnChart(
    document.getElementById("results_div")
  );
  chart.draw(data, options);
}
