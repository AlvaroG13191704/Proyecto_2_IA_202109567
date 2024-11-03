// global variable
let xTrain = [];
let yTrain = [];
let yPredict = [];
let treeData = [];
let headers = [];
let trainData = [];
let predictionData = [];
let model;
let tree;
let root;
let predictionTree;

// Function to get the inputs
function getInputs() {
  const changePercentageInputDiv = document.getElementById("percentagediv");
  const gradeInputDiv = document.getElementById("gradediv");

  return {
    changePercentageInputDiv,
    gradeInputDiv,
  };
}

function selectAlgorithm() {
  const modelSelected = document.getElementById("algorithmSelect").value;

  const { changePercentageInputDiv, gradeInputDiv } = getInputs();

  if (modelSelected === "linear_regression") {
    changePercentageInputDiv.style.display = "block";
    gradeInputDiv.style.display = "none";
  } else if (modelSelected === "polynomial_regression") {
    changePercentageInputDiv.style.display = "none";
    gradeInputDiv.style.display = "block";
  } else if (modelSelected === "decision_tree") {
    changePercentageInputDiv.style.display = "block";
    gradeInputDiv.style.display = "none";
  }
}

function loadFile(callback) {
  // get file
  const fileInput = document.getElementById("fileInput");
  const modelSelected = document.getElementById("algorithmSelect").value;
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, seleccione un archivo");
    return;
  }

  // read file
  const reader = new FileReader();
  reader.onload = function (event) {
    const data = event.target.result;

    if (modelSelected === "decision_tree") {
      processTreeFile(data);
    } else {
      processFile(data);
    }

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

// function to proccess the file of tree
function processTreeFile(data) {
  treeData = [];
  headers = [];

  const rows = data.split("\n");

  for (let i = 0; i < rows.length; i++) {
    if (i === 0) {
      headers = rows[i].split(",");
    } else {
      const item = rows[i].split(",");
      // clean the \r from the last element
      item[item.length - 1] = item[item.length - 1].replace("\r", "");

      treeData.push(item);
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
  } else if (modelSelected === "decision_tree") {
    const changePercentage = document.getElementById("changePercentage").value;
    let train;
    if (changePercentage === "") train = 0.8;
    else train = parseFloat(changePercentage);

    // clean
    // trainData = [];
    // predictionData = [];

    loadFile(function () {
      // USE THE DECISION TREE MODEL
      // console.log("Decision Tree");
      // console.log("Headers: ", headers);
      // console.log("Data: ", treeData);
      // console.log("data length: ", treeData.length);
      // const length = treeData.length;
      // const array = treeData
      // const trainData = array.slice(0, Math.floor(length * train));
      // trainData.unshift(headers);
      // const predictionData = array.slice(Math.floor(length * train));
      // predictionData.unshift(headers);
      // console.log("trainData ", trainData);
      // console.log("predictionData", predictionData);
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
  } else if (modelSelected === "decision_tree") {
    const changePercentage = document.getElementById("changePercentage").value;
    let train;
    if (changePercentage === "") train = 0.8;
    else train = parseFloat(changePercentage);
    const length = treeData.length;
    const array = treeData;

    const trainData = array.slice(0, Math.floor(length * train));

    trainData.unshift(headers);

    predictionData = array.slice(Math.floor(length * train));

    predictionData.unshift(headers);
    tree = new DecisionTreeID3(trainData);

    root = tree.train(tree.dataset);

    predictionTree = tree.predict(predictionData, root);

    document.getElementById("log").innerHTML +=
      "<br>Árbol de decisión entrenado.<br>Train Data: " +
      JSON.stringify(predictionTree);
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
  } else if (root && modelSelected === "decision_tree") {
    // const dot = tree.generateDotString(root);
    const dot = getgraphttree();

    const chart = document.getElementById("results_div");

    const parsDot = vis.network.convertDot(dot);
    const data = {
      nodes: parsDot.nodes,
      edges: parsDot.edges,
    };

    const options = {
      layout: {
        hierarchical: {
          levelSeparation: 100,
          nodeSpacing: 100,
          parentCentralization: true,
          direction: "UD", // UD, DU, LR, RL
          sortMethod: "directed",
        },
      },
    };

    // Crear la red de visualización
    const network = new vis.Network(chart, data, options);
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

function getgraphttree() {
  return `{aa9bb33445b4 [label="Children"];d5875e39cc7d [label="WorkTime"];aa9bb33445b4--d5875e39cc7d[label="No"];79b8ada68880 [label="Debts"];d5875e39cc7d--79b8ada68880[label="Short"];b9921b2d5c62 [label="No
"];79b8ada68880--b9921b2d5c62[label="Yes"];4d574a631965 [label="Yes
"];79b8ada68880--4d574a631965[label="No"];10e46724bebe [label="Yes
"];d5875e39cc7d--10e46724bebe[label="Long"];8c480ba41b5e [label="No
"];aa9bb33445b4--8c480ba41b5e[label="Several"];c200c682718d [label="Debts"];aa9bb33445b4--c200c682718d[label="One"];b1dbb7800d7c [label="Yes
"];c200c682718d--b1dbb7800d7c[label="No"];9070b79d29bd [label="No
"];c200c682718d--9070b79d29bd[label="Yes"];}`;
}
