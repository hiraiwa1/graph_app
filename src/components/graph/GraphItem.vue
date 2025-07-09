<script setup>
import { reactive, ref } from "vue";

// const fileNameList = ref([
//     "202210",
//     "202312",
//     "202401",
//     "202311"
//   ]);

const props = defineProps(["graphData", "title", "index"]);

const graphClickCount = {
  name: "クリック数",
  type: "column",
  data: props.graphData.map((data) =>
    Number(data.fileData.clickCount.replace(",", "")),
  ),
  color: "#b9c9fa",
};
const graphViewCount = {
  name: "表示回数",
  type: "column",
  data: props.graphData.map((data) =>
    Number(data.fileData.viewCount.replace(",", "")),
  ),
  color: "#caccd3",
};
const graphCtr = {
  name: "CTR",
  type: "line",
  data: props.graphData.map((data) =>
    Number(data.fileData.ctr.replace("%", "")),
  ),
  color: "#f94c1c",
};
const graphRanking = {
  name: "掲載順位",
  type: "line",
  data: props.graphData.map((data) =>
    Number(data.fileData.ranging.replace(",", "")),
  ),
  color: "#2654d6",
};

const initSeriesData = ref([
  graphClickCount,
  graphViewCount,
  graphCtr,
  graphRanking,
]);

const queryValue = ref(
  initSeriesData.value.map((seriesData) => ({
    name: seriesData.name,
    type: seriesData.type,
    checked: true,
  })),
);

const chartOptions = reactive({
  option: {
    chart: {
      width: 400,
      height: 200,
    },
    title: false,
    credits: false,
    legend: {
      enabled: false,
    },
    xAxis: [
      {
        categories: props.graphData.map((data) => data.fileName),
      },
    ],
    yAxis: [
      {
        title: false,
        gridLineColor: "#d0d0d0",
        gridLineDashStyle: "dash",
        labels: {
          formatter: (data) => data.value.toLocaleString(),
          style: {
            fontSize: "11px",
          },
          distance: 10,
        },
        maxPadding: 0.2,
      },
      {
        title: {
          text: false,
        },
        gridLineDashStyle: "dash",
        labels: {
          formatter: (data) => data.value.toLocaleString(),
          style: {
            fontSize: "11px",
          },
          distance: 10,
        },
        opposite: true,
      },
    ],
    plotOptions: {
      column: {
        maxPointWidth: 30,
        selected: true,
      },
      line: {
        yAxis: 1,
        selected: true,
        marker: false,
      },
    },
    series: initSeriesData.value,
  },
});

const upDate = (chart) => {
  const checkboxs = document.querySelectorAll(
    `.graph-select${props.index} input[type="checkbox"]`,
  );

  checkboxs.forEach((element, index) => {
    element.addEventListener("click", async () => {
      const serie = chart.series[index];

      const checked = element.checked;
      if (checked) {
        serie.show();
      } else {
        serie.hide();
      }
    });
  });
};
</script>

<template>
  <article :class="`graph graph${props.index}`">
    <h2><span>クエリ</span>{{ props.title }}</h2>
    <div class="table-area">
      <table>
        <thead>
          <tr>
            <th>対象</th>
            <th>クリック数</th>
            <th>表示回数</th>
            <th>CTR</th>
            <th>掲載順位</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data of props.graphData" :key="data.fileName">
            <td>{{ data.fileName || "" }}</td>
            <td>{{ data.fileData.clickCount || "" }}</td>
            <td>{{ data.fileData.viewCount || "" }}</td>
            <td>{{ data.fileData.ctr || "" }}</td>
            <td>{{ data.fileData.ranging || "" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <ul class="graph-legend-query">
        <li v-for="query of queryValue" :key="query">
          <span :class="query.type" :data-name="query.name"></span
          >{{ query.name }}
        </li>
      </ul>
      <div :class="`graph-area graph-area${props.index}`">
        <highcharts
          :options="chartOptions.option"
          :callback="(chart) => upDate(chart)"
        ></highcharts>
      </div>
      <div :class="`graph-select graph-select${props.index}`">
        <label v-for="query of queryValue" :key="query">
          <input type="checkbox" v-model="query.checked" />
          <span :class="query.checked ? `active` : `remove`"></span
          >{{ query.name }}
        </label>
      </div>
    </div>
  </article>
</template>

<style scoped>
.graph {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
h2 {
  background: var(--c-blue-l);
  display: block;
  border-radius: 8px;
  padding-block: 10px;
  font-size: 14px;
  font-weight: bold;
  overflow: hidden;
  overflow-x: scroll;
  scrollbar-width: none;
}
h2 > span {
  background-color: var(--c-blue);
  display: inline-block;
  padding-inline: 12px;
  margin-right: 12px;
  border-image: linear-gradient(0deg, var(--c-blue), var(--c-blue) 0% 100%) fill
    0 / 0 / 10px 0;
  color: var(--c-white);
  font-size: inherit;
  font-weight: inherit;
}

.table-area {
}
table {
  width: 100%;
  border-radius: 8px;
  border-collapse: separate;
  border-spacing: 0;
}
table th,
table td {
  padding-block: 6px;
  text-align: center;
}
table th {
  background-color: var(--c-gray);
  font-weight: bold;
  font-size: 12px;
}
table th:not(:first-child) {
  border-left: 0.5px solid rgba(12, 20, 41, 0.1);
}
table th:not(:last-child) {
  border-right: 0.5px solid rgba(12, 20, 41, 0.1);
}
table th:first-child {
  border-start-start-radius: 8px;
}
table th:last-child {
  border-start-end-radius: 8px;
}
table td {
  padding-inline: 8px;
  font-size: 12px;
  border: 0.5px solid rgba(12, 20, 41, 0.1);
}
table td:first-child {
  border-left-width: 2px;
}
table td:last-child {
  border-right-width: 2px;
}
tbody tr:last-child td {
  border-bottom-width: 2px;
}
tbody tr:last-child td:first-child {
  border-end-start-radius: 8px;
}
tbody tr:last-child td:last-child {
  border-end-end-radius: 8px;
}
table td:not(:first-child) {
  text-align: right;
}

.graph-legend-query {
  display: grid;
  grid-auto-flow: column;
  list-style: none;
  padding: 0;
  place-content: center;
  place-items: center;
  gap: 20px;
  margin-bottom: 2px;
}
.graph-legend-query li {
  font-size: 12px;
  font-weight: bold;
  display: grid;
  grid-template-rows: subgrid;
  grid-template-columns: 14px 1fr;
  gap: 8px;
  align-items: center;
}
.graph-legend-query li span {
  width: 14px;
  height: 14px;
  display: inline-block;
}
.graph-legend-query .column {
  border-radius: 4px;
}
.graph-legend-query .line {
  border-radius: 4px;
  height: 3px;
}
.graph-legend-query [data-name="クリック数"] {
  background-color: #b9c9fa;
}
.graph-legend-query [data-name="表示回数"] {
  background-color: #caccd3;
}
.graph-legend-query [data-name="CTR"] {
  background-color: #ff4f74;
}
.graph-legend-query [data-name="掲載順位"] {
  background-color: #2654d6;
}

.graph-select {
  padding-inline: 8px;
}
.graph-select label {
  display: inline-block;
  font-size: 14px;
  font-weight: bold;
}
.graph-select label:not(:last-child) {
  margin-right: 20px;
}
.graph-select input[type="checkbox"] {
  display: none;
}
.graph-select span {
  width: 18px;
  height: 18px;
  border: 2px solid var(--c-gray);
  display: inline-block;
  border-radius: 4px;
  margin-right: 8px;
  vertical-align: sub;
}

.graph-select input + span.active {
  background-color: #0aa0a6;
  background-image: url(/images/parts/icon_check.svg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: auto;
  border-color: #0aa0a6;
}
</style>
