import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { SalesDataService } from '../sales-data.service';
Chart.register(...registerables);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  salesData: any[] = []; // Will hold the sales data
  salesForm!: FormGroup; // Form to hold user inputs
  filteredSalesData: any[] = []; // Holds the filtered sales data
  dateForm!: FormGroup; // Form to hold the date inputs
  currentChartIndex = 0; // Start with the first chart
  totalCharts = 9; // Total number of charts
  currentChart: string = 'sales'; // Default chart
  fromDate: Date | null = null;
  toDate: Date | null = null;
  //define chart variable
  salesChart!: Chart;
  cancellationsChart!: Chart;
  performanceChart!: Chart;
  bookingSourceChart!: Chart;
  materialGroupChart!: Chart;
  areaChart!: Chart;
  materialGroup3Chart!: Chart;
  saleTypeChart!: Chart;
  channelChart!: Chart;
  salesComparisionChart!: Chart;
  cancellationsComparisionChart!: Chart;
  performanceComparisionChart!: Chart;
  bookingSourceComparisonChart!: Chart;
  materialGroupComparisonChart!: Chart;
  areaComparisionChart!: Chart;
  materialGroupbarChart!: Chart;
  bookingSourcebarChart!: Chart;
  materialGroup3barChart!: Chart;
  channelbarChart!: Chart;
  salespieChart!: Chart;

  activeCanvas: string = 'salesChart'; // Initial canvas to display
  activeChartInstance: Chart | null = null;
  isReportVisible = false;
  isFilterVisible = false;
  isSidebarOpen = true; // Sidebar starts open by default

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle the sidebar state
  }

  toggleReport() {
    this.isReportVisible = !this.isReportVisible; // Toggle the visibility
  }
  toggleFilter() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  @ViewChild('graphSection') graphSection!: ElementRef;

  constructor(
    private salesDataService: SalesDataService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.dateForm = this.fb.group({
      fromDate: null,
      toDate: null,
    });
  }
  scrollToGraph() {
    // Scroll to the graph section when called
    this.graphSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
  ngOnDestroy(): void {
    this.destroyChart(this.salesChart);
    this.destroyChart(this.cancellationsChart);
    this.destroyChart(this.bookingSourceChart);
    this.destroyChart(this.performanceChart);
    this.destroyChart(this.areaChart);
    this.destroyChart(this.saleTypeChart);
    this.destroyChart(this.materialGroupChart);
    this.destroyChart(this.materialGroup3Chart);
    this.destroyChart(this.channelChart);
    this.destroyChart(this.salesComparisionChart);
    this.destroyChart(this.cancellationsComparisionChart);
    this.destroyChart(this.performanceComparisionChart);
    this.destroyChart(this.bookingSourceComparisonChart);
    this.destroyChart(this.materialGroupComparisonChart);
    this.destroyChart(this.areaComparisionChart);
    this.destroyChart(this.materialGroupbarChart);
    this.destroyChart(this.bookingSourcebarChart);
    this.destroyChart(this.materialGroup3barChart);
    this.destroyChart(this.channelbarChart);
    this.destroyChart(this.salespieChart);
  }
  destroyChart(chart: Chart | undefined): void {
    if (chart) {
      chart.destroy();
    }
  }
  ngOnInit(): void {
    this.dateForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
    });
    //this.fetchSalesData(); // Fetch data on component initialization
    this.salesForm = this.fb.group({
      vkbur: ['1034'],
      vkorg: ['9000'],
      vbeln: [''],
      kunnr: [''],
      matnr: [''],
      budat: [''],
      auart: ['ZRS'],
    });
    this.renderChart(this.currentChart);
  }

  showChart(period: string) {
    this.currentChart = period; // Update the current chart
    this.cdr.detectChanges();
    // Clear existing charts and render the new one
    this.renderChart(period);
  }
  renderChart(period: string) {
    if (this.activeChartInstance) {
      this.activeChartInstance.destroy();
    }
    // Clear the previous chart if it exists
    if (period === 'sales') {
      this.scrollToGraph();
      this.createSalesChart();
      // this.createMonthlySalesComparisonChart(this.fromDate, this.toDate);
      this.createSalespieChart();
    } else if (period === 'cancellations') {
      this.createCancellationsChart();
      // this.createCancellationsComparisionChart();
      this.scrollToGraph();
    } else if (period === 'saleType') {
      this.scrollToGraph();
      this.createSaleTypeChart();
    } else if (period === 'bookingsource') {
      this.createBookingSourceChart();
      this.createBookingSourcebarChart();
      this.scrollToGraph();
    } else if (period === 'materialgroup') {
      this.createMaterialGroupChart();
      this.createMaterialGroupBarChart();
      this.scrollToGraph();
    } else if (period === 'area') {
      this.createAreaChart();
      this.createAreaComparisionChart();
      this.scrollToGraph();
    } else if (period === 'materialgroup3') {
      this.createMaterialGroup3Chart();
      // this.createMonthlySalesComparisonChart(this.fromDate, this.toDate);
      this.createMaterialGroup3barChart();
      this.scrollToGraph();
    } else if (period === 'performance') {
      this.createPerformanceChart();
      // this.createPerformanceComparisionChart(this.fromDate, this.toDate);
      this.scrollToGraph();
    } else if (period === 'channel') {
      this.createChannelChart();
      this.createChannelbarChart();
      this.scrollToGraph();
    }
  }

  // Method to fetch sales data
  fetchSalesData(): void {
    const formData = this.salesForm.value;
    console.log('Sending form data:', formData); // Log the form data
    this.salesDataService.getSalesReport(formData).subscribe(
      (data) => {
        console.log('Received data:', data); // Log the received data
        this.salesData = data; // Assign the data to salesData

        this.filteredSalesData = data; // Initially show all data
        this.createSalesChart();
        this.createCancellationsChart(); // Create chart for cancellations
        this.createPerformanceChart();
        this.createBookingSourceChart();
        this.createMaterialGroupChart();
        this.createAreaChart();
        this.createMaterialGroup3Chart();
        this.createSaleTypeChart();
        this.createChannelChart();
      },
      (error) => {
        console.error('Error fetching sales data:', error);
      }
    );
  }
  filterSalesData(): void {
    // Retrieve dates from the form
    const { fromDate, toDate } = this.dateForm.value;

    if (!fromDate || !toDate) {
      console.warn('From Date or To Date is missing.');
      this.filteredSalesData = this.salesData; // Show all data if no range selected
      return;
    }

    // Parse the input dates into JavaScript Date objects
    const fromParsedDate = new Date(fromDate);
    const toParsedDate = new Date(toDate);

    // Ensure the "To Date" is greater than or equal to "From Date"
    if (toParsedDate < fromParsedDate) {
      console.error('To Date cannot be earlier than From Date.');
      return;
    }

    // Filter the sales data
    this.filteredSalesData = this.salesData.filter((sale) => {
      // Check if AUDAT is valid
      if (!sale.AUDAT) {
        console.warn('AUDAT is missing or undefined for a sale record.');
        return false; // Exclude undefined AUDAT
      }

      const saleDate = this.parseDate(sale.AUDAT); // Parse AUDAT using parseDate
      if (!saleDate) {
        console.warn(`Invalid AUDAT format for: ${sale.AUDAT}`);
        return false; // Exclude invalid dates
      }

      // Debugging output
      console.log('From Date:', fromParsedDate);
      console.log('To Date:', toParsedDate);
      console.log('AUDAT:', sale.AUDAT, 'Parsed Date:', saleDate);

      return saleDate >= fromParsedDate && saleDate <= toParsedDate;
    });

    console.log('Filtered Sales Data:', this.filteredSalesData);
  }

  // parseDate(dateString: string): Date {
  //   const date = new Date(dateString);
  //   if (isNaN(date.getTime())) {
  //     throw new Error(`Invalid date string: ${dateString}`);
  //   }
  //   return date;
  // }
  parseDate(dateString: string): Date {
    // Check if the input format is DD.MM.YYYY
    const dateParts = dateString.split('.');
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed in JavaScript
      const year = parseInt(dateParts[2], 10);

      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    throw new Error(`Invalid date string: ${dateString}`);
  }

  // Method to create a sales chart
  // createSalesChart(): void {
  //   const labels = this.filteredSalesData.map((sale) => sale.AUDAT); // Assuming AUDAT is the sale date
  //   const salesValues = this.filteredSalesData.map((sale) => sale.MAIN); // Assuming 'MAIN' is the sales value

  //   const chartData = {
  //     labels,
  //     datasets: [
  //       {
  //         label: "Sales Amount",
  //         data: salesValues,
  //         backgroundColor: "rgb(255, 165, 0)", // Softer greenish color for bars
  //         borderColor: "rgba(75, 192, 192, 1)", // Darker green for borders
  //         borderWidth: 2,
  //         hoverBackgroundColor: "rgba(75, 192, 192, 0.8)", // Slightly darker hover color
  //         hoverBorderColor: "rgba(75, 192, 192, 1)", // Same hover border
  //       },
  //     ],
  //   };

  //   const config: ChartConfiguration = {
  //     type: "bar" as ChartType, // Keeping 'bar' chart
  //     data: chartData,
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false, // Allow the chart to resize dynamically
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           grid: {
  //             color: "rgba(200, 200, 200, 0.2)", // Subtle grid lines for cleaner look
  //           },
  //           ticks: {
  //             color: "#333", // Darker tick labels for better readability
  //             font: {
  //               family: "Arial", // Custom font for better legibility
  //               size: 12, // Slightly larger font
  //             },
  //           },
  //         },
  //         x: {
  //           grid: {
  //             color: "rgba(200, 200, 200, 0.2)", // Subtle grid lines on the x-axis as well
  //           },
  //           ticks: {
  //             color: "#333", // Darker tick labels for better readability
  //             font: {
  //               family: "Arial", // Custom font for x-axis labels
  //               size: 12,
  //             },
  //           },
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: "top", // Position the legend at the top of the chart
  //           labels: {
  //             color: "#333", // Darker legend text for improved visibility
  //             font: {
  //               family: "Arial", // Custom font for legend labels
  //               size: 14, // Slightly larger font size for the legend
  //             },
  //           },
  //         },
  //         tooltip: {
  //           backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark background for tooltips
  //           titleColor: "#fff", // White tooltip title
  //           bodyColor: "#fff", // White tooltip text
  //           borderWidth: 1,
  //           borderColor: "rgba(255, 255, 255, 0.5)", // Subtle border around tooltips
  //           callbacks: {
  //             label: (context) => {
  //               const value = context.raw;
  //               return `Sales: ${value} .Rs`; // Format the tooltip label
  //             },
  //           },
  //         },
  //       },
  //     },
  //   };

  //   // Destroy the existing chart if already rendered
  //   if (this.salesChart) {
  //     this.salesChart.destroy();
  //   }

  //   // Get the canvas element and initialize the chart
  //   const ctx = (
  //     document.getElementById("salesChart") as HTMLCanvasElement
  //   ).getContext("2d");
  //   this.salesChart = new Chart(ctx, config);
  // }
  createSalesChart(): void {
    const labels = this.filteredSalesData.map((sale) => sale.AUDAT); // Assuming AUDAT is the sale date
    const salesValues = this.filteredSalesData.map((sale) => sale.MAIN); // Assuming 'MAIN' is the sales value

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Sales Amount',
          data: salesValues,
          backgroundColor: 'rgb(255, 165, 0)', // Orange color for bars
          borderColor: 'rgba(255, 140, 0, 1)', // Darker orange for borders
          borderWidth: 2,
          hoverBackgroundColor: 'rgba(255, 140, 0, 0.8)', // Slightly darker orange on hover
          hoverBorderColor: 'rgba(255, 140, 0, 1)', // Same darker border for hover
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'bar' as ChartType, // Keeping 'bar' chart
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to resize dynamically
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(200, 200, 200, 0.2)', // Subtle grid lines for cleaner look
            },
            ticks: {
              color: '#333', // Darker tick labels for better readability
              font: {
                family: 'Arial', // Custom font for better legibility
                size: 12, // Slightly larger font
              },
            },
          },
          x: {
            grid: {
              color: 'rgba(200, 200, 200, 0.2)', // Subtle grid lines on the x-axis as well
            },
            ticks: {
              color: '#333', // Darker tick labels for better readability
              font: {
                family: 'Arial', // Custom font for x-axis labels
                size: 12,
              },
            },
          },
        },
        plugins: {
          legend: {
            position: 'top', // Position the legend at the top of the chart
            labels: {
              color: '#333', // Darker legend text for improved visibility
              font: {
                family: 'Arial', // Custom font for legend labels
                size: 14, // Slightly larger font size for the legend
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for tooltips
            titleColor: '#fff', // White tooltip title
            bodyColor: '#fff', // White tooltip text
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.5)', // Subtle border around tooltips
            callbacks: {
              label: (context) => {
                const value = context.raw;
                return `Sales: ${value} .Rs`; // Format the tooltip label
              },
            },
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.salesChart) {
      this.salesChart.destroy();
    }

    // Get the canvas element and initialize the chart
    const canvas = document.getElementById('salesChart') as HTMLCanvasElement;

    const ctx = canvas?.getContext('2d');
    if (ctx) {
      this.salesChart = new Chart(ctx, config);
    } else {
      console.error('canvas context is null');
    }
  }
  createSalespieChart(): void {
    const labels = this.filteredSalesData.map((sale) => sale.AUDAT); // Assuming AUDAT is the sale date
    const salesValues = this.filteredSalesData.map((sale) => sale.MAIN); // Assuming 'MAIN' is the sales value

    // Generate a unique color for each label
    const generateUniqueColors = (numColors: number) => {
      const colors = [];
      for (let i = 0; i < numColors; i++) {
        const hue = Math.floor((360 / numColors) * i); // Spread hues evenly across the color wheel
        colors.push(`hsla(${hue}, 70%, 60%, 0.6)`); // Adjust saturation and lightness as needed
      }
      return colors;
    };

    const uniqueBackgroundColors = generateUniqueColors(labels.length);
    const uniqueHoverBackgroundColors = generateUniqueColors(labels.length).map(
      (color) => color.replace('0.6', '0.8') // Slightly darken colors on hover
    );

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Sales Amount',
          data: salesValues,
          backgroundColor: uniqueBackgroundColors,
          borderColor: 'rgba(255, 255, 255, 1)', // White border for each slice
          borderWidth: 1,
          hoverBackgroundColor: uniqueHoverBackgroundColors,
          hoverBorderColor: 'rgba(255, 255, 255, 1)',
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'pie' as ChartType,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#333',
              font: {
                family: 'Arial',
                size: 14,
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.5)',
            callbacks: {
              label: (context) => {
                const value = context.raw;
                return `Sales: ${value} .Rs`; // Format the tooltip label
              },
            },
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.salespieChart) {
      this.salespieChart.destroy();
    }

    // Get the canvas element and initialize the chart
    const canvas = document.getElementById(
      'salespieChart'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      this.salespieChart = new Chart(ctx, config);
    } else {
      console.error('canvas context is null');
    }
  }

  // createMonthlySalesComparisonChart(fromDate: string, toDate: string): void {
  //   // Parse the input dates
  //   const startDate = this.parseDate(this.fromDate);
  //   const endDate = this.parseDate(this.toDate);

  //   // Filter sales data for the given date range
  //   const salesInRange = this.filteredSalesData.filter((sale) => {
  //     const saleDate = this.parseDate(sale.AUDAT);
  //     return saleDate >= startDate && saleDate <= endDate;
  //   });
  //   // Debugging: Log filtered sales
  //   console.log('Filtered Sales in Range:', salesInRange);
  //   // Generate an array of all months between fromDate and toDate
  //   const allMonths: string[] = [];
  //   let currentDate = new Date(
  //     startDate.getFullYear(),
  //     startDate.getMonth(),
  //     1
  //   );
  //   while (currentDate <= endDate) {
  //     const monthYear = `${currentDate.getFullYear()}-${(
  //       currentDate.getMonth() + 1
  //     )
  //       .toString()
  //       .padStart(2, '0')}`;
  //     allMonths.push(monthYear);
  //     currentDate.setMonth(currentDate.getMonth() + 1);
  //   }
  //   console.log('All Months in Range:', allMonths);

  //   // Group sales by month
  //   const monthlySales = salesInRange.reduce((acc, sale) => {
  //     const saleDate = this.parseDate(sale.AUDAT);
  //     const monthYear = `${saleDate.getFullYear()}-${(saleDate.getMonth() + 1)
  //       .toString()
  //       .padStart(2, '0')}`;

  //     if (!acc[monthYear]) {
  //       acc[monthYear] = 0;
  //     }
  //     acc[monthYear] += Number(sale.MAIN);
  //     return acc;
  //   }, {});
  //   // Ensure all months in the range are included, even with 0 sales
  //   allMonths.forEach((month) => {
  //     if (!monthlySales[month]) {
  //       monthlySales[month] = 0;
  //     }
  //   });

  //   // Prepare data for the chart
  //   const labels = Object.keys(monthlySales).sort();
  //   const data = labels.map((month) => monthlySales[month]);

  //   const chartData = {
  //     labels: labels.map((month) => {
  //       const [year, monthNum] = month.split('-');
  //       return new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString(
  //         'default',
  //         { month: 'long', year: 'numeric' }
  //       );
  //     }),
  //     datasets: [
  //       {
  //         label: 'Monthly Sales',
  //         data: data,
  //         backgroundColor: 'rgb(0, 100, 0)',
  //         borderColor: 'rgba(75, 192, 192, 1)',
  //         borderWidth: 1,
  //       },
  //     ],
  //   };

  //   const config: ChartConfiguration = {
  //     type: 'bar' as ChartType,
  //     data: chartData,
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           title: {
  //             display: true,
  //             text: 'Total Sales',
  //           },
  //         },
  //         x: {
  //           title: {
  //             display: true,
  //             text: 'Month',
  //           },
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           display: false, // Hide legend as we only have one dataset
  //         },
  //         tooltip: {
  //           callbacks: {
  //             label: (context) => {
  //               const value = context.raw as number;
  //               return `Total Sales: ${value.toFixed(2)} Rs`;
  //             },
  //           },
  //         },
  //       },
  //     },
  //   };

  //   // Destroy the existing chart if already rendered
  //   if (this.salesComparisionChart) {
  //     this.salesComparisionChart.destroy();
  //   }

  //   // Get the canvas element and initialize the chart
  //   const canvas = document.getElementById(
  //     'salesComparisionChart'
  //   ) as HTMLCanvasElement;
  //   const ctx = canvas?.getContext('2d');
  //   if (ctx) {
  //     this.salesComparisionChart = new Chart(ctx, config);
  //   } else {
  //     console.error('');
  //   }
  // }

  // createSalesComparisonChart(): void {
  //   // Assuming that 'this.filteredSalesData' contains all the sales data for both months
  //   // Group sales data by month.
  //   const month1Sales = this.filteredSalesData.filter((sale) =>
  //     sale.AUDAT.startsWith("01-09-2023")
  //   );
  //   const month2Sales = this.filteredSalesData.filter((sale) =>
  //     sale.AUDAT.startsWith("01-10-2023")
  //   );

  //   const labels = month1Sales.map((sale) => sale.AUDAT); // Assuming sales are on the same dates
  //   const month1Values = month1Sales.map((sale) => sale.MAIN); // September sales values
  //   const month2Values = month2Sales.map((sale) => sale.MAIN); // October sales values

  //   const chartData = {
  //     labels, // Using the same labels for both months (dates)
  //     datasets: [
  //       {
  //         label: "September Sales",
  //         data: month1Values,
  //         backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue color for September
  //         borderColor: "rgba(54, 162, 235, 1)",
  //         borderWidth: 2,
  //         hoverBackgroundColor: "rgba(54, 162, 235, 0.8)", // Darker on hover
  //         hoverBorderColor: "rgba(54, 162, 235, 1)",
  //       },
  //       {
  //         label: "October Sales",
  //         data: month2Values,
  //         backgroundColor: "rgba(255, 99, 132, 0.6)", // Red color for October
  //         borderColor: "rgba(255, 99, 132, 1)",
  //         borderWidth: 2,
  //         hoverBackgroundColor: "rgba(255, 99, 132, 0.8)", // Darker on hover
  //         hoverBorderColor: "rgba(255, 99, 132, 1)",
  //       },
  //     ],
  //   };

  //   const config: ChartConfiguration = {
  //     type: "bar" as ChartType, // Bar chart for comparison
  //     data: chartData,
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           grid: {
  //             color: "rgba(200, 200, 200, 0.3)",
  //           },
  //           ticks: {
  //             color: "#333",
  //             font: {
  //               family: "Arial",
  //               size: 12,
  //             },
  //           },
  //         },
  //         x: {
  //           grid: {
  //             color: "rgba(200, 200, 200, 0.3)",
  //           },
  //           ticks: {
  //             color: "#333",
  //             font: {
  //               family: "Arial",
  //               size: 12,
  //             },
  //           },
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: "top",
  //           labels: {
  //             color: "#333",
  //             font: {
  //               family: "Arial",
  //               size: 14,
  //             },
  //           },
  //         },
  //         tooltip: {
  //           backgroundColor: "rgba(0, 0, 0, 0.7)",
  //           titleColor: "#fff",
  //           bodyColor: "#fff",
  //           borderWidth: 1,
  //           borderColor: "rgba(255, 255, 255, 0.5)",
  //           callbacks: {
  //             label: (context) => {
  //               const value = context.raw;
  //               return `Sales: $${value}`; // Format the tooltip label
  //             },
  //           },
  //         },
  //       },
  //     },
  //   };

  //   // Destroy the existing chart if already rendered
  //   if (this.salesComparisionChart) {
  //     this.salesComparisionChart.destroy();
  //   }

  //   // Get the canvas element and initialize the chart
  //   const ctx = (
  //     document.getElementById("salesComparisionChart") as HTMLCanvasElement
  //   ).getContext("2d");
  //   this.salesComparisionChart = new Chart(ctx, config);
  // }

  // Method to create a cancellations chart
  createCancellationsChart() {
    const labels = this.filteredSalesData.map((sale) => sale.AUDAT); // Assuming AUDAT is the sale date
    const cancellations = this.filteredSalesData.filter(
      (sale) => sale.CANC_CHRG
    ).length; // Filter cancelled sales

    // Group by date for cancellations
    const cancellationCounts = this.filteredSalesData.reduce((acc, sale) => {
      if (sale.CANC_CHRG) {
        const saleDate = this.parseDate(sale.AUDAT).toDateString(); // Group by date
        acc[saleDate] = (acc[saleDate] || 0) + 1; // Count cancellations per date
        console.log(
          'Cancellations Data: ',
          this.filteredSalesData.filter((sale) => sale.CANC_CHRG)
        );
      }
      return acc;
    }, {});

    const chartLabels = Object.keys(cancellationCounts);
    const chartData = Object.values(cancellationCounts) as number[];

    const config: ChartConfiguration = {
      type: 'bar' as ChartType, // Can be 'bar', 'line', 'pie', etc.
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Cancellations',
            data: chartData,
            backgroundColor: 'rgb(177, 47, 47)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 2,
          },
        },
      },
    };
    const canvas = document.getElementById(
      'cancellationsChart'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (canvas) {
      const chartCtx = canvas.getContext('2d');
      if (chartCtx) {
        this.activeChartInstance = new Chart(chartCtx, config);
      } else {
        console.error('Failed to get 2D context for cancellations chart');
      }
    } else {
      console.error('Cancellations chart element not found');
    }

    // Destroy the existing chart if already rendered
    if (this.cancellationsChart) {
      this.cancellationsChart.destroy();
    }
  }
  createCancellationsComparisionChart(fromDate: string, toDate: string): void {
    //valid the input dates
    if (!fromDate || !toDate) {
      console.error('Invalid date range provided');
      return;
    }
    // Parse the input dates
    const startDate = this.parseDate(fromDate);
    const endDate = this.parseDate(toDate);
    if (!startDate || isNaN(startDate.getTime())) {
      console.error(`Invalid startDate: ${fromDate}`);
      return;
    }
    if (!endDate || isNaN(endDate.getTime())) {
      console.error(`Invalid endDate: ${toDate}`);
      return;
    }
    // Generate an array of all months between fromDate and toDate

    const allMonths = [];
    let currentDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1
    );
    while (currentDate <= endDate) {
      const monthYear = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}`;
      allMonths.push(monthYear);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Group cancellations by month
    const cancellationCounts = this.filteredSalesData.reduce((acc, sale) => {
      const saleDate = this.parseDate(sale.AUDAT);
      if (sale.CANC_CHRG && saleDate) {
        const monthYear = `${saleDate.getFullYear()}-${(saleDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;
        if (!acc[monthYear]) {
          acc[monthYear] = 0;
        }
        acc[monthYear] += 1;
      }
      return acc;
    }, {});

    // Ensure all months in the range are included, even with 0 cancellations
    allMonths.forEach((month) => {
      if (!cancellationCounts[month]) {
        cancellationCounts[month] = 0; // Initialize to 0 if no cancellations were found
      }
    });

    // Prepare data for the chart
    const labels = Object.keys(cancellationCounts).sort();
    const data = labels.map((month) => cancellationCounts[month]);

    const chartData = {
      labels: labels.map((month) => {
        const [year, monthNum] = month.split('-');
        return new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString(
          'default',
          { month: 'long', year: 'numeric' }
        );
      }),
      datasets: [
        {
          label: 'Cancellations',
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'bar' as ChartType, // Can be 'bar', 'line', 'pie', etc.
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Cancellations',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Month',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `Cancellations: ${value}`;
              },
            },
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.cancellationsComparisionChart) {
      this.cancellationsComparisionChart.destroy();
    }

    // Get the canvas element and initialize the chart
    const canvas = document.getElementById(
      'cancellationsComparisionChart'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      this.cancellationsChart = new Chart(ctx, config);
    } else {
      console.error('');
    }
  }

  //method to create performance chart
  createPerformanceChart(): void {
    // Aggregate performance data by sales executive
    const performanceData = this.filteredSalesData.reduce((acc, sale) => {
      const execName = sale.SALE_EXE;
      acc[execName] = (acc[execName] || 0) + Number(sale.MAIN);
      return acc;
    }, {});

    const execLabels = Object.keys(performanceData); // Sales executive names
    const execSalesValues = Object.values(performanceData) as number[]; // Their total sales amounts

    const config: ChartConfiguration = {
      type: 'bar' as ChartType, // Bar chart for performance
      data: {
        labels: execLabels,
        datasets: [
          {
            label: 'Sales Executive Performance',
            data: execSalesValues,
            backgroundColor: 'rgba(153, 102, 255, 0.6)', // Softer purple for bar background
            borderColor: 'rgba(153, 102, 255, 1)', // Darker purple for bar borders
            borderWidth: 2,
            hoverBackgroundColor: 'rgba(153, 102, 255, 0.8)', // Slightly darker on hover
            hoverBorderColor: 'rgba(153, 102, 255, 1)', // Same border on hover
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)', // Subtle white grid lines
            },
            ticks: {
              color: '#333', // Darker tick labels
              font: {
                family: 'Arial',
                size: 12, // Custom font size for y-axis
              },
            },
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)', // Subtle white grid lines for x-axis
            },
            ticks: {
              color: '#333', // Darker tick labels for x-axis
              font: {
                family: 'Arial',
                size: 12, // Custom font size for x-axis
              },
            },
          },
        },
        plugins: {
          legend: {
            position: 'top', // Position legend at the top
            labels: {
              color: '#333', // Darker text for legend
              font: {
                family: 'Arial',
                size: 14, // Larger font for legend
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for tooltips
            titleColor: '#fff', // White title text
            bodyColor: '#fff', // White body text
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.5)', // Subtle border for tooltips
            callbacks: {
              label: (context) => {
                const value = context.raw;
                return `Sales: ${value}. Rs`; // Format the tooltip label
              },
            },
          },
        },
      },
    };

    const canvas = document.getElementById(
      'performanceChart'
    ) as HTMLCanvasElement;
    if (canvas) {
      const chartCtx = canvas.getContext('2d');
      if (chartCtx) {
        // Destroy the existing chart if already rendered
        if (this.performanceChart) {
          this.performanceChart.destroy();
        }

        this.performanceChart = new Chart(chartCtx, config);
      } else {
        console.error('Failed to get 2D context for performance chart');
      }
    } else {
      console.error('Performance chart element not found');
    }
  }
  // createPerformanceComparisionChart(fromDate: string, toDate: string): void {
  //   // Parse the input dates
  //   const startDate = this.parseDate(fromDate);
  //   const endDate = this.parseDate(toDate);

  //   // Generate an array of all months between fromDate and toDate
  //   const allMonths: string[] = [];
  //   let currentDate = new Date(
  //     startDate.getFullYear(),
  //     startDate.getMonth(),
  //     1
  //   );
  //   while (currentDate <= endDate) {
  //     const monthYear = `${currentDate.getFullYear()}-${(
  //       currentDate.getMonth() + 1
  //     )
  //       .toString()
  //       .padStart(2, '0')}`;
  //     allMonths.push(monthYear);
  //     currentDate.setMonth(currentDate.getMonth() + 1);
  //   }

  //   // Aggregate performance data by sales executive and month
  //   const performanceData = this.filteredSalesData.reduce((acc, sale) => {
  //     const execName = sale.SALE_EXE;
  //     const saleDate = this.parseDate(sale.AUDAT);
  //     const monthYear = `${saleDate.getFullYear()}-${(saleDate.getMonth() + 1)
  //       .toString()
  //       .padStart(2, '0')}`;

  //     if (!acc[monthYear]) {
  //       acc[monthYear] = {};
  //     }

  //     acc[monthYear][execName] =
  //       (acc[monthYear][execName] || 0) + Number(sale.MAIN);
  //     return acc;
  //   }, {});

  //   // Prepare labels and datasets for the chart
  //   const execNames = [
  //     ...new Set(this.filteredSalesData.map((sale) => sale.SALE_EXE)),
  //   ]; // Unique sales executives
  //   const chartData = {
  //     labels: allMonths.map((month) => {
  //       const [year, monthNum] = month.split('-');
  //       return new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString(
  //         'default',
  //         { month: 'long', year: 'numeric' }
  //       );
  //     }),
  //     datasets: execNames.map((execName) => {
  //       const data = allMonths.map(
  //         (month) => performanceData[month]?.[execName] || 0
  //       ); // Get data for each month or 0
  //       return {
  //         label: execName,
  //         data: data,
  //         backgroundColor: this.getRandomColor(), // Function to get random colors for each dataset
  //         borderColor: 'rgba(153, 102, 255, 1)', // Consistent border color for clarity
  //         borderWidth: 2,
  //         hoverBackgroundColor: 'rgba(153, 102, 255, 0.8)',
  //         hoverBorderColor: 'rgba(153, 102, 255, 1)',
  //       };
  //     }),
  //   };

  //   const config: ChartConfiguration = {
  //     type: 'bar' as ChartType,
  //     data: chartData,
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           grid: {
  //             color: 'rgba(255, 255, 255, 0.1)',
  //           },
  //           ticks: {
  //             color: '#333',
  //             font: {
  //               family: 'Arial',
  //               size: 12,
  //             },
  //           },
  //         },
  //         x: {
  //           grid: {
  //             color: 'rgba(255, 255, 255, 0.1)',
  //           },
  //           ticks: {
  //             color: '#333',
  //             font: {
  //               family: 'Arial',
  //               size: 12,
  //             },
  //           },
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //           labels: {
  //             color: '#333',
  //             font: {
  //               family: 'Arial',
  //               size: 14,
  //             },
  //           },
  //         },
  //         tooltip: {
  //           backgroundColor: 'rgba(0, 0, 0, 0.7)',
  //           titleColor: '#fff',
  //           bodyColor: '#fff',
  //           borderWidth: 1,
  //           borderColor: 'rgba(255, 255, 255, 0.5)',
  //           callbacks: {
  //             label: (context) => {
  //               const value = context.raw;
  //               return `Sales: ${value} .Rs`;
  //             },
  //           },
  //         },
  //       },
  //     },
  //   };

  //   // Destroy the existing chart if already rendered
  //   if (this.performanceComparisionChart) {
  //     this.performanceComparisionChart.destroy();
  //   }

  //   const ctx = document.getElementById(
  //     'performanceComparisionChart'
  //   ) as HTMLCanvasElement;
  //   if (ctx) {
  //     const chartCtx = ctx.getContext('2d');
  //     if (chartCtx) {
  //       this.performanceChart = new Chart(chartCtx, config);
  //     } else {
  //       console.error('Failed to get 2D context for performance chart');
  //     }
  //   } else {
  //     console.error('Performance chart element not found');
  //   }
  // }
  createPerformanceComparisionChart(): void {
    // Aggregate performance data by sales executive
    const performanceData = this.filteredSalesData.reduce((acc, sale) => {
      const execName = sale.SALE_EXE;
      acc[execName] = (acc[execName] || 0) + Number(sale.MAIN);
      return acc;
    }, {});

    const execLabels = Object.keys(performanceData); // Sales executive names
    const execSalesValues = Object.values(performanceData) as number[]; // Their total sales amounts

    const config: ChartConfiguration = {
      type: 'pie' as ChartType, // Pie chart for performance
      data: {
        labels: execLabels,
        datasets: [
          {
            label: 'Sales Executive Performance',
            data: execSalesValues,
            backgroundColor: [
              'rgba(153, 102, 255, 0.6)', // Purple
              'rgba(75, 192, 192, 0.6)', // Green
              'rgba(255, 159, 64, 0.6)', // Orange
              'rgba(54, 162, 235, 0.6)', // Blue
              'rgba(255, 99, 132, 0.6)', // Red
            ],
            borderColor: [
              'rgba(153, 102, 255, 1)', // Purple
              'rgba(75, 192, 192, 1)', // Green
              'rgba(255, 159, 64, 1)', // Orange
              'rgba(54, 162, 235, 1)', // Blue
              'rgba(255, 99, 132, 1)', // Red
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top', // Position legend at the top
            labels: {
              color: '#333', // Darker text for legend
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for tooltips
            titleColor: '#fff', // White title text
            bodyColor: '#fff', // White body text
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.5)', // Subtle border for tooltips
            callbacks: {
              label: (context) => {
                const value = context.raw;
                return `Sales: ${value}. Rs`; // Format the tooltip label
              },
            },
          },
        },
      },
    };

    const canvas = document.getElementById(
      'performanceComparisionChart'
    ) as HTMLCanvasElement;
    if (canvas) {
      const chartCtx = canvas.getContext('2d');
      if (chartCtx) {
        // Destroy the existing chart if already rendered
        if (this.performanceComparisionChart) {
          this.performanceComparisionChart.destroy();
        }

        this.performanceComparisionChart = new Chart(chartCtx, config);
      } else {
        console.error('Failed to get 2D context for performance pie chart');
      }
    } else {
      console.error('Performance pie chart element not found');
    }
  }

  // Utility function to get random colors for the datasets
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  createBookingSourceChart(): void {
    // Group sales data by booking source
    const bookingSourceCounts = this.filteredSalesData.reduce((acc, sale) => {
      const source = sale.KVGR2 || 'Unknown'; // Use a default value if no source is present
      acc[source] = (acc[source] || 0) + 1; // Count the occurrences of each source
      return acc;
    }, {});

    const labels = Object.keys(bookingSourceCounts); // Booking sources
    const data = Object.values(bookingSourceCounts) as number[]; // Count of each source

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Source of Booking',
          data: data,
          backgroundColor: [
            '#FF7F2A',
            '#64E468',
            '#4DB8FF',
            '#5B55DD',
            '#6F8FC6',
            'rgb(245 104 43)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'pie' as ChartType, // Pie chart type
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.bookingSourceChart) {
      this.bookingSourceChart.destroy();
    }

    const canvas = document.getElementById(
      'bookingSourceChart'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      this.bookingSourceChart = new Chart(ctx, config);
    } else {
      console.error('');
    }
  }
  createBookingSourcebarChart(): void {
    // Group sales data by booking source
    const bookingSourceCounts = this.filteredSalesData.reduce((acc, sale) => {
      const source = sale.KVGR2 || 'Unknown'; // Use a default value if no source is present
      acc[source] = (acc[source] || 0) + 1; // Count the occurrences of each source
      return acc;
    }, {});

    const labels = Object.keys(bookingSourceCounts); // Booking sources
    const data = Object.values(bookingSourceCounts) as number[]; // Count of each source

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Source of Booking',
          data: data,
          backgroundColor: [
            '#FF7F2A',
            '#64E468',
            '#4DB8FF',
            '#5B55DD',
            '#6F8FC6',
            'rgb(245 104 43)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'bar' as ChartType, // Bar chart type
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Booking Count',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Source of Booking',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.bookingSourcebarChart) {
      this.bookingSourcebarChart.destroy();
    }

    const canvas = document.getElementById(
      'bookingSourcebarChart'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      this.bookingSourcebarChart = new Chart(ctx, config);
    } else {
      console.error('');
    }
  }

  createBookingSourceComparisonChart(): void {
    // Define types for the accumulator object
    type BookingSourceComparison = {
      [source: string]: {
        [category: string]: number;
      };
    };

    // Group sales data by booking source and category
    const bookingSourceComparison: BookingSourceComparison =
      this.filteredSalesData.reduce(
        (acc, sale) => {
          const source = sale.KVGR2 || 'Unknown'; // Booking source
          const category = Number(sale.MAIN) || 'Other'; // Example of a category for comparison

          if (!acc[source]) {
            acc[source] = {};
          }

          acc[source][category] = (acc[source][category] || 0) + 1; // Count occurrences
          return acc;
        },
        {} as BookingSourceComparison // Initialize as an empty object with the correct type
      );

    const labels = Object.keys(bookingSourceComparison); // Booking sources
    const categories = Array.from(
      new Set(
        Object.values(bookingSourceComparison).flatMap((source) =>
          Object.keys(source)
        )
      )
    ); // Unique categories for comparison

    const dataset = categories.map((category) => ({
      label: category,
      data: labels.map(
        (source) => bookingSourceComparison[source][category] || 0
      ), // Data for each source/category
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.6)`, // Random colors for each category
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 1)`,
      borderWidth: 1,
    }));

    const config: ChartConfiguration = {
      type: 'bar' as ChartType, // Bar chart type
      data: {
        labels,
        datasets: dataset,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.bookingSourceComparisonChart) {
      this.bookingSourceComparisonChart.destroy();
    }

    const ctx = document.getElementById(
      'bookingSourceComparisonChart'
    ) as HTMLCanvasElement;
    this.bookingSourceComparisonChart = new Chart(ctx, config);
  }

  // Method to create a material group chart
  createMaterialGroupChart(): void {
    const materialGroups = this.filteredSalesData.reduce((acc, sale) => {
      const group = sale.MATKL; // Assuming MATERIAL_GROUP is the field name
      acc[group] = (acc[group] || 0) + Number(sale.MAIN); // Sum sales values by material group
      return acc;
    }, {});

    const chartLabels = Object.keys(materialGroups);
    const chartData = Object.values(materialGroups) as number[];

    const config: ChartConfiguration = {
      type: 'pie' as ChartType, // Pie chart
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Material Group',
            data: chartData,
            backgroundColor: [
              'rgba(86, 80, 200,0.8)',
              'rgba(72, 226, 109,0.8)',
              'rgba(245, 104, 43,0.8)',
            ],
            borderColor: 'rgba(153, 102, 255, 0.6)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };

    if (this.materialGroupChart) {
      this.materialGroupChart.destroy();
    }

    const canvas = document.getElementById(
      'materialGroupChart'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      this.materialGroupChart = new Chart(ctx, config);
    } else {
      console.error('');
    }
  }
  // Method to create a material group bar chart
  createMaterialGroupBarChart(): void {
    const materialGroups = this.filteredSalesData.reduce((acc, sale) => {
      const group = sale.MATKL; // Assuming MATERIAL_GROUP is the field name
      acc[group] = (acc[group] || 0) + Number(sale.MAIN); // Sum sales values by material group
      return acc;
    }, {});

    const chartLabels = Object.keys(materialGroups);
    const chartData = Object.values(materialGroups) as number[];

    const config: ChartConfiguration = {
      type: 'bar' as ChartType, // Bar chart
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Material Group',
            data: chartData,
            backgroundColor: [
              'rgba(86, 80, 200,0.8)',
              'rgba(72, 226, 109,0.8)',
              'rgba(245, 104, 43,0.8)',
            ],
            borderColor: 'rgba(153, 102, 255, 0.6)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Sales Value',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Material Group',
            },
          },
        },
      },
    };

    if (this.materialGroupbarChart) {
      this.materialGroupbarChart.destroy();
    }

    const canvas = document.getElementById(
      'materialGroupbarChart'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      this.materialGroupbarChart = new Chart(ctx, config);
    } else {
      console.error('');
    }
  }

  createMaterialGroupComparisonChart(): void {
    // Group sales data by material group and another variable (e.g., region or another category)
    const materialGroupComparison = this.filteredSalesData.reduce(
      (acc, sale) => {
        const group = sale.MATKL; // Material group
        const category = Number(sale.MAIN) || 'Other'; // Example of a category for comparison

        if (!acc[group]) {
          acc[group] = {};
        }

        acc[group][category] = (acc[group][category] || 0) + Number(sale.MAIN); // Sum sales values
        return acc;
      },
      {}
    );

    const labels = Object.keys(materialGroupComparison); // Material groups
    const categories = Array.from(
      new Set(
        Object.values(materialGroupComparison).flatMap(
          (group) => Object.keys(group as Record<string, number>) // Type assertion here
        )
      )
    ); // Unique categories for comparison

    const dataset = categories.map((category) => ({
      label: category,
      data: labels.map(
        (group) => materialGroupComparison[group][category] || 0
      ), // Data for each group/category
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.6)`, // Random colors for each category
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 1)`,
      borderWidth: 1,
    }));

    const config: ChartConfiguration = {
      type: 'bar' as ChartType, // Bar chart type
      data: {
        labels,
        datasets: dataset,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.materialGroupComparisonChart) {
      this.materialGroupComparisonChart.destroy();
    }

    const ctx = document.getElementById(
      'materialGroupComparisonChart'
    ) as HTMLCanvasElement;
    this.materialGroupComparisonChart = new Chart(ctx, config);
  }

  //method to create an area chart
  createAreaChart(): void {
    const areas = this.filteredSalesData.reduce((acc, sale) => {
      const area = sale.UMREN; // Assuming UMREN is the field name for area
      acc[area] = (acc[area] || 0) + Number(sale.MAIN); // Sum sales values by area
      return acc;
    }, {});

    const chartLabels = Object.keys(areas);
    const chartData = Object.values(areas) as number[];

    const config: ChartConfiguration = {
      type: 'bar' as ChartType, // Change to 'bar' chart
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Sales by Area',
            data: chartData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)', // Red
              'rgba(54, 162, 235, 0.6)', // Blue
              'rgba(255, 206, 86, 0.6)', // Yellow
              'rgba(75, 192, 192, 0.6)', // Green
              'rgba(153, 102, 255, 0.6)', // Purple
              'rgba(255, 159, 64, 0.6)', // Orange
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(200, 200, 200, 0.2)', // Customize grid lines
            },
            ticks: {
              color: '#666', // Customize y-axis labels color
            },
          },
          x: {
            grid: {
              color: 'rgba(200, 200, 200, 0.2)', // Customize grid lines
            },
            ticks: {
              color: '#666', // Customize x-axis labels color
            },
          },
        },
        plugins: {
          legend: {
            position: 'top', // Move the legend to the top
            labels: {
              color: '#333', // Customize legend text color
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darken the tooltip background
            titleColor: '#fff',
            bodyColor: '#fff',
          },
        },
      },
    };

    if (this.areaChart) {
      this.areaChart.destroy();
    }

    const canvas = document.getElementById('areaChart') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      this.areaChart = new Chart(ctx, config);
    } else {
      console.error('');
    }
  }
  createAreaComparisionChart(): void {
    const areas = this.filteredSalesData.reduce((acc, sale) => {
      const area = sale.UMREN; // Assuming UMREN is the field name for area
      acc[area] = (acc[area] || 0) + Number(sale.MAIN); // Sum sales values by area
      return acc;
    }, {});

    const chartLabels = Object.keys(areas);
    const chartData = Object.values(areas) as number[];

    const config: ChartConfiguration = {
      type: 'pie' as ChartType, // Change to 'pie' chart
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Sales by Area',
            data: chartData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)', // Red
              'rgba(54, 162, 235, 0.6)', // Blue
              'rgba(255, 206, 86, 0.6)', // Yellow
              'rgba(75, 192, 192, 0.6)', // Green
              'rgba(153, 102, 255, 0.6)', // Purple
              'rgba(255, 159, 64, 0.6)', // Orange
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top', // Move the legend to the top
            labels: {
              color: '#333', // Customize legend text color
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darken the tooltip background
            titleColor: '#fff',
            bodyColor: '#fff',
          },
        },
      },
    };

    if (this.areaComparisionChart) {
      this.areaComparisionChart.destroy();
    }

    const canvas = document.getElementById(
      'areaComparisionChart'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      this.areaComparisionChart = new Chart(ctx, config);
    } else {
      console.error('Canvas not found');
    }
  }

  // createAreaComparisionChart(fromDate: string, toDate: string): void {
  //   // Parse the input dates
  //   const startDate = this.parseDate(fromDate);
  //   const endDate = this.parseDate(toDate);

  //   // Generate an array of all months between fromDate and toDate
  //   const allMonths: string[] = [];
  //   let currentDate = new Date(
  //     startDate.getFullYear(),
  //     startDate.getMonth(),
  //     1
  //   );
  //   while (currentDate <= endDate) {
  //     const monthYear = `${currentDate.getFullYear()}-${(
  //       currentDate.getMonth() + 1
  //     )
  //       .toString()
  //       .padStart(2, '0')}`;
  //     allMonths.push(monthYear);
  //     currentDate.setMonth(currentDate.getMonth() + 1);
  //   }

  //   // Aggregate performance data by area and month
  //   const areaPerformanceData = this.filteredSalesData.reduce((acc, sale) => {
  //     const area = sale.UMREN; // Assuming UMREN is the field name for area
  //     const saleDate = this.parseDate(sale.AUDAT);
  //     const monthYear = `${saleDate.getFullYear()}-${(saleDate.getMonth() + 1)
  //       .toString()
  //       .padStart(2, '0')}`;

  //     if (!acc[monthYear]) {
  //       acc[monthYear] = {};
  //     }

  //     acc[monthYear][area] = (acc[monthYear][area] || 0) + Number(sale.MAIN);
  //     return acc;
  //   }, {});

  //   // Prepare labels and datasets for the chart
  //   const areaNames = [
  //     ...new Set(this.filteredSalesData.map((sale) => sale.UMREN)),
  //   ]; // Unique areas
  //   const chartData = {
  //     labels: allMonths.map((month) => {
  //       const [year, monthNum] = month.split('-');
  //       return new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString(
  //         'default',
  //         { month: 'long', year: 'numeric' }
  //       );
  //     }),
  //     datasets: areaNames.map((areaName) => {
  //       const data = allMonths.map(
  //         (month) => areaPerformanceData[month]?.[areaName] || 0
  //       ); // Get data for each month or 0
  //       return {
  //         label: areaName,
  //         data: data,
  //         backgroundColor: this.getRandomColor(), // Function to get random colors for each dataset
  //         borderColor: 'rgba(75, 192, 192, 1)', // Consistent border color for clarity
  //         borderWidth: 2,
  //         fill: true, // This property enables the area filling
  //         tension: 0.3, // Optional: adds some smoothing to the lines
  //       };
  //     }),
  //   };

  //   const config: ChartConfiguration = {
  //     type: 'line' as ChartType, // Use 'line' type for area chart
  //     data: chartData,
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           grid: {
  //             color: 'rgba(200, 200, 200, 0.2)', // Customize grid lines
  //           },
  //           ticks: {
  //             color: '#666', // Customize y-axis labels color
  //           },
  //         },
  //         x: {
  //           grid: {
  //             color: 'rgba(200, 200, 200, 0.2)', // Customize grid lines
  //           },
  //           ticks: {
  //             color: '#666', // Customize x-axis labels color
  //           },
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top', // Move the legend to the top
  //           labels: {
  //             color: '#333', // Customize legend text color
  //           },
  //         },
  //         tooltip: {
  //           backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darken the tooltip background
  //           titleColor: '#fff',
  //           bodyColor: '#fff',
  //           callbacks: {
  //             label: (context) => {
  //               const value = context.raw;
  //               return `Sales: ${value} .Rs`; // Customize tooltip label
  //             },
  //           },
  //         },
  //       },
  //     },
  //   };

  //   // Destroy the existing chart if already rendered
  //   if (this.areaComparisionChart) {
  //     this.areaComparisionChart.destroy();
  //   }

  //   const ctx = document.getElementById(
  //     'areaComparisionChart'
  //   ) as HTMLCanvasElement;
  //   if (ctx) {
  //     const chartCtx = ctx.getContext('2d');
  //     if (chartCtx) {
  //       this.areaChart = new Chart(chartCtx, config);
  //     } else {
  //       console.error('Failed to get 2D context for area performance chart');
  //     }
  //   } else {
  //     console.error('Area performance chart element not found');
  //   }
  // }

  // Method to create a material group 3 chart
  createMaterialGroup3Chart(): void {
    const materialGroup3 = this.filteredSalesData.reduce((acc, sale) => {
      const group3 = sale.MVGR3; // Assuming MATERIAL_GROUP_3 is the field name
      acc[group3] = (acc[group3] || 0) + Number(sale.MAIN); // Sum sales values by material group 3
      return acc;
    }, {});

    const chartLabels = Object.keys(materialGroup3);
    const chartData = Object.values(materialGroup3) as number[];

    const config: ChartConfiguration = {
      type: 'pie' as ChartType,
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Material Group 3',
            data: chartData,
            backgroundColor: [
              'rgb(86 80 200)',
              'rgb(72 226 109)',
              'rgb(245 104 43)',
            ],
            borderColor: 'rgba(255, 205, 86, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };

    if (this.materialGroup3Chart) {
      this.materialGroup3Chart.destroy();
    }

    const canvas = document.getElementById(
      'materialGroup3Chart'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      this.materialGroup3Chart = new Chart(ctx, config);
    } else {
      console.error('');
    }
  }
  createMaterialGroup3barChart(): void {
    const materialGroup3 = this.filteredSalesData.reduce((acc, sale) => {
      const group3 = sale.MVGR3; // Assuming MATERIAL_GROUP_3 is the field name
      acc[group3] = (acc[group3] || 0) + Number(sale.MAIN); // Sum sales values by material group 3
      return acc;
    }, {});

    const chartLabels = Object.keys(materialGroup3);
    const chartData = Object.values(materialGroup3) as number[];

    const config: ChartConfiguration = {
      type: 'bar' as ChartType, // Bar chart type
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Material Group 3',
            data: chartData,
            backgroundColor: [
              'rgb(86 80 200)',
              'rgb(72 226 109)',
              'rgb(245 104 43)',
            ],
            borderColor: 'rgba(255, 205, 86, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Sales Value',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Material Group 3',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.materialGroup3barChart) {
      this.materialGroup3barChart.destroy();
    }

    const canvas = document.getElementById(
      'materialGroup3barChart'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      this.materialGroup3barChart = new Chart(ctx, config);
    } else {
      console.error('');
    }
  }

  // Method to create a sale type chart
  createSaleTypeChart(): void {
    const saleTypes = this.filteredSalesData.reduce((acc, sale) => {
      const type = sale.KVGR5; // Assuming SALE_TYPE is the field name
      acc[type] = (acc[type] || 0) + Number(sale.MAIN); // Sum sales values by sale type
      return acc;
    }, {});

    const chartLabels = Object.keys(saleTypes);
    const chartData = Object.values(saleTypes) as number[];

    const config: ChartConfiguration = {
      type: 'pie' as ChartType,
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Sale Type',
            data: chartData,
            backgroundColor: [
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: 'rgba(255, 205, 86, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#FFFFFF', // White legend text
              font: {
                size: 14, // Smaller font size for legend
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark tooltip background
            titleColor: '#FFFFFF', // White tooltip title
            bodyColor: '#FFFFFF', // White tooltip body
          },
        },
      },
    };

    if (this.saleTypeChart) {
      this.saleTypeChart.destroy();
    }

    const canvas = document.getElementById(
      'saleTypeChart'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      this.saleTypeChart = new Chart(ctx, config);
    } else {
      console.error('');
    }
  }

  // Method to create a channel chart
  createChannelChart(): void {
    const channels = this.filteredSalesData.reduce((acc, sale) => {
      const channel = sale.CHANNEL; // Assuming CHANNEL is the field name
      acc[channel] = (acc[channel] || 0) + Number(sale.MAIN); // Sum sales values by channel
      return acc;
    }, {});

    const chartLabels = Object.keys(channels);
    const chartData = Object.values(channels) as number[];

    const config: ChartConfiguration = {
      type: 'pie' as ChartType,
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Channel',
            data: chartData,
            backgroundColor: [
              'rgba(86, 80, 200,0.6)',
              'rgba(72, 226, 109,0.6)',
              'rgba(245, 104, 43,0.6)',
            ],
            borderColor: 'rgba(255, 205, 86, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };

    if (this.channelChart) {
      this.channelChart.destroy();
    }

    const canvas = document.getElementById('channelChart') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      this.channelChart = new Chart(ctx, config);
    } else {
      console.error('');
    }
  }
  createChannelbarChart(): void {
    const channels = this.filteredSalesData.reduce((acc, sale) => {
      const channel = sale.CHANNEL; // Assuming CHANNEL is the field name
      acc[channel] = (acc[channel] || 0) + Number(sale.MAIN); // Sum sales values by channel
      return acc;
    }, {});

    const chartLabels = Object.keys(channels);
    const chartData = Object.values(channels) as number[];

    const config: ChartConfiguration = {
      type: 'bar' as ChartType, // Bar chart type
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Sales by Channel',
            data: chartData,
            backgroundColor: [
              'rgba(86, 80, 200, 0.6)',
              'rgba(72, 226, 109, 0.6)',
              'rgba(245, 104, 43, 0.6)',
            ],
            borderColor: [
              'rgba(86, 80, 200, 1)',
              'rgba(72, 226, 109, 1)',
              'rgba(245, 104, 43, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Sales Value',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Channel',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.channelbarChart) {
      this.channelbarChart.destroy();
    }

    const canvas = document.getElementById(
      'channelbarChart'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      this.channelbarChart = new Chart(ctx, config);
    } else {
      console.error('');
    }
  }

  // Method to update charts based on the filtered data
  updateCharts(): void {
    this.createSalesChart(); // Recreate the chart with the filtered data
    this.createCancellationsChart();
    this.createPerformanceChart();
    this.createBookingSourceChart();
    this.createMaterialGroupChart();
    this.createAreaChart();
    this.createMaterialGroup3Chart();
    this.createSaleTypeChart();
    this.createChannelChart();
    //this.createMonthlySalesComparisonChart();
    //this.createCancellationsComparisionChart();
    // this.createPerformanceComparisionChart();
    this.createBookingSourceComparisonChart();
    this.createMaterialGroupComparisonChart();
    //this.createAreaComparisionChart();
  }
}
