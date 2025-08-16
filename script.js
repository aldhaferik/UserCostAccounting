// Wait for the DOM to load before initialising tables and charts
document.addEventListener('DOMContentLoaded', function () {
  // Initialise DataTables on all tables with class 'display'
  $('#scorecard-table').DataTable({
    paging: false,
    info: false,
    searching: false,
    ordering: true,
  });
  $('#dual-table').DataTable({
    paging: false,
    info: false,
    searching: false,
    ordering: false,
  });
  $('#carbon-table').DataTable({
    paging: false,
    info: false,
    searching: false,
    ordering: false,
  });

  // Add tooltip to scorecard ratings
  $('#scorecard-table tbody td').each(function () {
    const desc = $(this).data('desc');
    if (desc) {
      $(this).attr('title', desc);
    }
  });

  // Create SWACC chart
  const swaccCtx = document.getElementById('swaccChart').getContext('2d');
  const lambdas = [];
  const reff = [];
  const rcorp = 10; // 10% corporate WACC
  const rsocial = 3; // 3% social discount rate
  for (let i = 0; i <= 10; i++) {
    const lambda = i / 10;
    lambdas.push(lambda.toFixed(1));
    const eff = (1 - lambda) * rcorp + lambda * rsocial;
    reff.push(eff.toFixed(2));
  }
  new Chart(swaccCtx, {
    type: 'line',
    data: {
      labels: lambdas,
      datasets: [
        {
          label: 'Effective Discount Rate (r_eff)',
          data: reff,
          borderColor: '#005c97',
          backgroundColor: 'rgba(0,92,151,0.1)',
          fill: true,
          tension: 0.2,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'SWACC Blending: r_eff vs λ (lambda)',
          color: '#143774',
          font: { size: 14, weight: 'bold' },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return 'r_eff: ' + context.parsed.y + '%';
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'λ (Lambda) – Weight on Sustainability' },
        },
        y: {
          title: { display: true, text: 'Discount Rate (%)' },
          beginAtZero: true,
        },
      },
    },
  });

  // Create Income Statement Comparison chart
  const incomeCtx = document.getElementById('incomeChart').getContext('2d');
  new Chart(incomeCtx, {
    type: 'bar',
    data: {
      labels: ['Operating Profit', 'Pre-tax Income', 'Net Income'],
      datasets: [
        {
          label: 'Traditional',
          data: [6225, 6006, 3751],
          backgroundColor: 'rgba(20, 55, 116, 0.7)',
        },
        {
          label: 'Sustainable',
          data: [5228, 5010, 3121],
          backgroundColor: 'rgba(0, 92, 151, 0.7)',
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Traditional vs Sustainable Income Statement (USD m)',
          color: '#143774',
          font: { size: 14, weight: 'bold' },
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: false,
        },
        y: {
          title: { display: true, text: 'Amount (USD m)' },
          beginAtZero: true,
        },
      },
    },
  });

  // Create Carbon Budget chart
  const carbonCtx = document.getElementById('carbonChart').getContext('2d');
  const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2030', '2040'];
  const emissions = [4.5, 4.4, 4.0, 3.6, 3.3, 3.0, 2.0, 0.0];
  const budgets = [50.0, 45.6, 41.6, 38.0, 34.7, 31.7, 20.0, 0.0];
  new Chart(carbonCtx, {
    data: {
      labels: years,
      datasets: [
        {
          type: 'bar',
          label: 'Emissions (Mt CO₂)',
          data: emissions,
          backgroundColor: 'rgba(20, 55, 116, 0.7)',
          yAxisID: 'y1',
        },
        {
          type: 'line',
          label: 'Carbon Budget Remaining (Mt)',
          data: budgets,
          borderColor: '#005c97',
          backgroundColor: 'rgba(0, 92, 151, 0.2)',
          fill: true,
          yAxisID: 'y2',
          tension: 0.3,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Carbon Budget and Emissions Over Time',
          color: '#143774',
          font: { size: 14, weight: 'bold' },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              if (context.datasetIndex === 0) {
                return 'Emissions: ' + context.parsed.y + ' Mt CO₂';
              } else {
                return 'Budget Remaining: ' + context.parsed.y + ' Mt';
              }
            },
          },
        },
      },
      scales: {
        y1: {
          position: 'left',
          title: { display: true, text: 'Emissions (Mt CO₂)' },
          beginAtZero: true,
        },
        y2: {
          position: 'right',
          title: { display: true, text: 'Carbon Budget Remaining (Mt)' },
          beginAtZero: true,
          grid: {
            drawOnChartArea: false,
          },
        },
        x: {
          title: { display: true, text: 'Year' },
        },
      },
    },
  });
});