// Function to get the inputs
function getInputs() {
  const secondInputFileDiv = document.getElementById("secondFileInput");
  const thirdInputFileDiv = document.getElementById("thirdFileInput");
  const changePercentageInputDiv = document.getElementById("percentagediv");
  const gradeInputDiv = document.getElementById("gradediv");

  return {
    secondInputFileDiv,
    thirdInputFileDiv,
    changePercentageInputDiv,
    gradeInputDiv,
  };
}

function selectAlgorithm() {
  const modelSelected = document.getElementById("algorithmSelect").value;

  const {
    secondInputFileDiv,
    thirdInputFileDiv,
    changePercentageInputDiv,
    gradeInputDiv
  } = getInputs();

  if (modelSelected === "linear_regression") {
    secondInputFileDiv.style.display = "none";
    thirdInputFileDiv.style.display = "none";
    changePercentageInputDiv.style.display = "block";
    gradeInputDiv.style.display = "none";
  } else if (modelSelected ===  "polynomial_regression") {
    secondInputFileDiv.style.display = "none";
    thirdInputFileDiv.style.display = "none";
    changePercentageInputDiv.style.display = "none";
    gradeInputDiv.style.display = "block";
  } else if (modelSelected === "decision_tree") {
    secondInputFileDiv.style.display = "block";
    thirdInputFileDiv.style.display = "none";
    changePercentageInputDiv.style.display = "none";
    gradeInputDiv.style.display = "none";
  } else if (modelSelected === "neural_network") {
    secondInputFileDiv.style.display = "block";
    thirdInputFileDiv.style.display = "block";
    changePercentageInputDiv.style.display = "none";
    gradeInputDiv.style.display = "none";
  }

}
