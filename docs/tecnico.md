# Manual Técnico
## Alvaro Norberto García Meza
## 202109567

## Descripción General

Este script es una aplicación de aprendizaje automático en JavaScript que permite seleccionar y entrenar modelos de regresión (lineal y polinomial y árbol de decisiones) sobre datos de entrada, realizar predicciones, y visualizar patrones y tendencias. Utiliza Google Charts para mostrar gráficas de los resultados.

### Componentes Principales
1. **Obtención de inputs y selección del modelo**: Permite seleccionar un modelo y visualizar diferentes opciones de entrada en la interfaz.
2. **Carga y procesamiento de archivos**: Carga datos de entrada y los procesa para entrenar los modelos.
3. **Entrenamiento de modelos**: Entrena modelos de regresión seleccionados con los datos de entrada.
4. **Predicción y visualización**: Genera predicciones y visualiza resultados en gráficos.
5. **Análisis de tendencias y patrones**: Detecta tendencias ascendentes o descendentes y patrones en los datos (como picos y valles).

---

## Funciones

### `getInputs()`
- **Propósito**: Obtiene los elementos de entrada del DOM necesarios para visualizar las opciones de los diferentes modelos en la interfaz.
- **Retorna**: Un objeto que contiene referencias a los elementos de entrada de la interfaz.

### `selectAlgorithm()`
- **Propósito**: Muestra u oculta campos de entrada en la interfaz según el modelo seleccionado por el usuario (`linear_regression`, `polynomial_regression`, `decision_tree`, `neural_network`).
- **Flujo**:
  - Dependiendo del modelo seleccionado, ajusta la visibilidad de los elementos `secondInputFileDiv`, `thirdInputFileDiv`, `changePercentageInputDiv`, y `gradeInputDiv`.

### `loadFile(callback)`
- **Propósito**: Carga el archivo de entrada seleccionado por el usuario y procesa su contenido.
- **Parámetros**:
  - `callback`: Una función que se ejecuta después de cargar el archivo (usada para entrenar el modelo una vez que los datos estén cargados).
- **Flujo**:
  - Lee el archivo de entrada como texto y llama a `processFile(data)` para procesar los datos.

### `processFile(data)`
- **Propósito**: Procesa los datos cargados del archivo, extrayendo los valores de entrada (`xTrain`) y salida (`yTrain`).
- **Parámetros**:
  - `data`: Contenido del archivo cargado.
- **Flujo**:
  - Divide el contenido del archivo en filas y extrae valores numéricos de cada fila, almacenándolos en `xTrain` y `yTrain`.

### `trainModel()`
- **Propósito**: Entrena el modelo seleccionado usando los datos de entrada procesados.
- **Flujo**:
  - Verifica el modelo seleccionado y entrena el modelo adecuado (`LinearRegression` o `PolynomialRegression`) utilizando `xTrain` e `yTrain`.
  - Muestra en el DOM el log del proceso de entrenamiento y las variables de entrenamiento.

### `predictModel()`
- **Propósito**: Realiza predicciones con el modelo entrenado.
- **Flujo**:
  - Si el modelo ha sido entrenado, realiza predicciones y las muestra en el elemento `results_div` en el DOM.

### `showGraph()`
- **Propósito**: Muestra una gráfica de las predicciones realizadas.
- **Flujo**:
  - Crea una gráfica de dispersión con la biblioteca Google Charts, mostrando `xTrain`, `yTrain` y `yPredict`.
  - Si aún no se han realizado predicciones, muestra una alerta al usuario.

### `showTrend()`
- **Propósito**: Muestra la tendencia general en los datos de entrada.
- **Flujo**:
  - Calcula la pendiente de `yTrain` para determinar si la tendencia es ascendente o descendente.
  - Muestra el gráfico de tendencia usando Google Charts.

### `showPatterns()`
- **Propósito**: Detecta patrones en los datos de entrada (como picos y valles).
- **Flujo**:
  - Identifica picos y valles en `yTrain`.
  - Muestra un gráfico de columnas con los patrones detectados usando Google Charts.

### `drawChart(dataArray)`
- **Propósito**: Dibuja un gráfico combinado de dispersión y línea usando Google Charts.
- **Parámetros**:
  - `dataArray`: Arreglo de datos para la gráfica, combinando `xTrain`, `yTrain`, y `yPredict`.

### `drawTrendChart(dataArray)`
- **Propósito**: Dibuja un gráfico de línea para visualizar la tendencia en los datos.
- **Parámetros**:
  - `dataArray`: Arreglo de datos para la gráfica de tendencia.

### `drawPatternChart(dataArray)`
- **Propósito**: Dibuja un gráfico de columnas para visualizar patrones en los datos.
- **Parámetros**:
  - `dataArray`: Arreglo de datos para la gráfica de patrones.

---

## Variables Globales

- `xTrain`, `yTrain`: Arrays para almacenar los datos de entrada y salida del archivo.
- `yPredict`: Array para almacenar las predicciones realizadas por el modelo.
- `model`: Variable para almacenar el modelo de aprendizaje automático seleccionado.

---

## Uso del Script

1. **Seleccionar un modelo**: El usuario selecciona el modelo en el menú desplegable.
2. **Cargar un archivo de datos**: Usa el botón para seleccionar y cargar un archivo CSV.
3. **Entrenar el modelo**: Presiona el botón de entrenamiento para procesar y ajustar el modelo con los datos.
4. **Realizar predicciones**: Genera predicciones y visualízalas en la interfaz.
5. **Mostrar gráficas y análisis**: Muestra gráficos de predicciones, tendencias y patrones detectados.

---

## Requerimientos

- **Biblioteca de Google Charts**: Para visualizar los gráficos.
- **Modelo de Aprendizaje Automático**: Las clases `LinearRegression` y `PolynomialRegression` deben estar definidas y proporcionar métodos `fit` y `predict`.

## Notas
- La funcionalidad actual se centra en la regresión lineal y polinomial; los modelos adicionales (`decision_tree` y `neural_network`) aún no están implementados.
