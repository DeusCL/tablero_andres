import { CivilWorksService } from '../services/civilWorks.js';

export class DashboardView extends HTMLElement {
    constructor() {
        super();
        this.state = {
            data: [],
            filteredData: [],
            selectedYears: [],
            selectedMonths: [],
            selectedTipos: [],
            selectedEdificios: [],
            selectedHHs: [],
            selectedZonals: [],
            searchString: '',
            sortBy: 'id',
            sortOrder: 'asc',
            currentPage: 1,
            itemsPerPage: 10,
            showTimelineChart: false
        };

        this.colors = {
            bgCard: '#1e1f1c',
            textMain: '#ffffff',
            textMuted: '#75715e',
            pink: '#f92672',
            green: '#a6e22e',
            cyan: '#66d9ef',
            yellow: '#e6db74',
            orange: '#fd971f',
            purple: '#ae81ff',
            gridLine: '#3e3d32'
        };

        this.charts = {};
    }

    async connectedCallback() {
        this.renderLayout();
        await this.loadData();
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.handleResize.bind(this));
        Object.values(this.charts).forEach(chart => chart.dispose());
    }

    handleResize() {
        Object.values(this.charts).forEach(chart => chart.resize());
    }

    async loadData() {
        try {
            const data = await CivilWorksService.getDashboardData();
            this.state.data = data;
            this.state.filteredData = [...data];
            this.initFilters();
            this.updateDashboard();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.innerHTML = `<div class="error-msg" style="padding: 2rem; color: #f92672;">Error al cargar los datos del dashboard. Por favor intente nuevamente o asegúrese de haber cargado un archivo Excel.</div>`;
        }
    }

    formatCurrency(val) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(val);
    }

    formatPercent(val) {
        return (val).toFixed(1) + '%';
    }

    renderLayout() {
        this.innerHTML = `
            <aside class="sidebar">
                <div class="sidebar-header">
                    <div class="logo-container">
                        <img src="./assets/img/logo_rdc.png" alt="Logotipo RDC" class="logo-img">
                    </div>
                    <div class="sidebar-title">Filtros de Análisis</div>
                </div>
                <div class="sidebar-content">
                    <button id="btn-reset" class="btn btn-danger">Limpiar Filtros</button>

                    <div class="filter-section">
                        <span class="filter-label">Año</span>
                        <div id="filter-year" class="filter-list"></div>
                    </div>

                    <div class="filter-section">
                        <span class="filter-label">Mes</span>
                        <div id="filter-month" class="month-grid">
                            <button type="button" class="month-btn" data-month="1">Ene</button>
                            <button type="button" class="month-btn" data-month="2">Feb</button>
                            <button type="button" class="month-btn" data-month="3">Mar</button>
                            <button type="button" class="month-btn" data-month="4">Abr</button>
                            <button type="button" class="month-btn" data-month="5">May</button>
                            <button type="button" class="month-btn" data-month="6">Jun</button>
                            <button type="button" class="month-btn" data-month="7">Jul</button>
                            <button type="button" class="month-btn" data-month="8">Ago</button>
                            <button type="button" class="month-btn" data-month="9">Sep</button>
                            <button type="button" class="month-btn" data-month="10">Oct</button>
                            <button type="button" class="month-btn" data-month="11">Nov</button>
                            <button type="button" class="month-btn" data-month="12">Dic</button>
                        </div>
                    </div>

                    <div class="filter-section">
                        <span class="filter-label">Tipo de Trabajo</span>
                        <div id="filter-tipo" class="filter-list"></div>
                    </div>

                    <div class="filter-section">
                        <span class="filter-label">Edificio / Instalación</span>
                        <div id="filter-edificio" class="filter-list"></div>
                    </div>

                    <div class="filter-section">
                        <span class="filter-label">Encargado (HH)</span>
                        <div id="filter-hh" class="filter-list"></div>
                    </div>

                    <div class="filter-section">
                        <span class="filter-label">Zona Geográfica</span>
                        <div id="filter-zonal" class="filter-list"></div>
                    </div>
                </div>
            </aside>

            <main class="main-content">
                <header class="top-actions">
                    <div class="page-title-group">
                        <h1>Tablero de Control - Obras y Servicios</h1>
                        <p>Análisis interactivo de desempeño, inversiones y rentabilidad</p>
                    </div>
                </header>

                <section class="kpis-grid">
                    <article class="kpi-card kpi-jobs">
                        <div class="kpi-title">Total de Trabajos</div>
                        <div class="kpi-value" id="kpi-total-trabajos">-</div>
                        <div class="kpi-subtitle">Trabajos registrados</div>
                    </article>
                    <article class="kpi-card kpi-neto">
                        <div class="kpi-title">Monto Neto Total</div>
                        <div class="kpi-value" id="kpi-monto-neto">-</div>
                        <div class="kpi-subtitle">Facturación neta</div>
                    </article>
                    <article class="kpi-card kpi-margin">
                        <div class="kpi-title">Margen Total</div>
                        <div class="kpi-value" id="kpi-margen-total">-</div>
                        <div class="kpi-subtitle">Ganancia bruta estimada</div>
                    </article>
                    <article class="kpi-card kpi-rentabilidad">
                        <div class="kpi-title">Rentabilidad Total</div>
                        <div class="kpi-value" id="kpi-rentabilidad-total">-</div>
                        <div class="kpi-subtitle">Porcentaje sobre neto</div>
                    </article>
                </section>

                <section class="charts-grid">
                    <div class="chart-card full-width-chart" style="position: relative;">
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                            <div class="chart-title">Evolución Temporal de Inversión</div>
                            <button id="btn-toggle-evolucion" class="btn" style="width: auto; padding: 0.4rem 0.8rem; font-size: 0.85rem; background-color: var(--bg-input); border: 1px solid var(--border-color); color: var(--text-main); margin-bottom: 0.5rem;">Ver Animado</button>
                        </div>
                        <div class="chart-body" id="chart-evolucion"></div>
                    </div>
                    <div class="chart-card chart-span-2">
                        <div class="chart-title">Inversión por Tipo de Trabajo</div>
                        <div class="chart-body" id="chart-tipo"></div>
                    </div>
                    <div class="chart-card chart-span-4">
                        <div class="chart-title">Inversión vs Margen por Edificio</div>
                        <div class="chart-body" id="chart-edificio-monto"></div>
                    </div>
                    <div class="chart-card chart-span-3">
                        <div class="chart-title">Cantidad de Trabajos por Edificio</div>
                        <div class="chart-body" id="chart-edificio-trabajos"></div>
                    </div>
                    <div class="chart-card chart-span-3">
                        <div class="chart-title">Facturación y Margen por Encargado</div>
                        <div class="chart-body" id="chart-encargado"></div>
                    </div>
                    <div class="chart-card chart-span-3">
                        <div class="chart-title">Inversión por Zona Geográfica</div>
                        <div class="chart-body" id="chart-zonal"></div>
                    </div>
                </section>

                <section class="table-section">
                    <div class="chart-title">Detalle de Trabajos</div>
                    <div class="table-controls">
                        <div class="search-container">
                            <span class="search-icon">🔍</span>
                            <input type="text" id="table-search" class="search-input" placeholder="Buscar trabajos...">
                        </div>
                        <div class="table-meta" id="table-count-info"></div>
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th id="th-numero_trabajo">Nº Trab</th>
                                    <th id="th-fecha">Fecha</th>
                                    <th id="th-detalle" style="width: 30%">Detalle</th>
                                    <th id="th-tipo">Tipo</th>
                                    <th id="th-edificio">Edificio</th>
                                    <th id="th-hh">Encargado</th>
                                    <th id="th-zonal">Zonal</th>
                                    <th id="th-monto_neto" style="text-align: right">Monto Neto</th>
                                    <th id="th-margin" style="text-align: right">Margen</th>
                                    <th id="th-rent" style="text-align: right">Rent %</th>
                                </tr>
                            </thead>
                            <tbody id="table-body"></tbody>
                        </table>
                    </div>
                    <footer class="pagination">
                        <div id="table-page-info" class="table-meta"></div>
                        <div class="pagination-controls" id="table-pagination"></div>
                    </footer>
                </section>
            </main>
        `;

        this.addEventListeners();
        this.initCharts();
    }

    initCharts() {
        const chartIds = ['chart-evolucion', 'chart-tipo', 'chart-edificio-monto', 'chart-edificio-trabajos', 'chart-encargado', 'chart-zonal'];
        chartIds.forEach(id => {
            const el = this.querySelector(`#${id}`);
            if (el) {
                this.charts[id] = echarts.init(el);
            }
        });
    }

    addEventListeners() {
        this.querySelector('#btn-reset').addEventListener('click', () => this.resetFilters());
        
        const btnToggle = this.querySelector('#btn-toggle-evolucion');
        if (btnToggle) {
            btnToggle.addEventListener('click', () => {
                this.state.showTimelineChart = !this.state.showTimelineChart;
                btnToggle.textContent = this.state.showTimelineChart ? 'Ver Estático' : 'Ver Animado';
                this.updateDashboard();
            });
        }

        this.querySelector('#table-search').addEventListener('input', (e) => {
            this.state.searchString = e.target.value.toLowerCase();
            this.state.currentPage = 1;
            this.renderTable();
        });

        const headers = ['numero_trabajo', 'fecha', 'detalle', 'tipo', 'edificio', 'hh', 'zonal', 'monto_neto', 'margin', 'rent'];
        headers.forEach(field => {
            const el = this.querySelector(`#th-${field}`);
            if (el) {
                el.addEventListener('click', () => {
                    if (this.state.sortBy === field) {
                        this.state.sortOrder = this.state.sortOrder === 'asc' ? 'desc' : 'asc';
                    } else {
                        this.state.sortBy = field;
                        this.state.sortOrder = 'asc';
                    }
                    this.renderTable();
                });
            }
        });

        const monthBtns = this.querySelectorAll('.month-btn');
        monthBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const month = parseInt(btn.dataset.month);
                if (this.state.selectedMonths.includes(month)) {
                    this.state.selectedMonths = this.state.selectedMonths.filter(m => m !== month);
                    btn.classList.remove('active');
                } else {
                    this.state.selectedMonths.push(month);
                    btn.classList.add('active');
                }
                this.state.currentPage = 1;
                this.updateDashboard();
            });
        });
    }

    initFilters() {
        const alphanumericSort = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });

        const years = [...new Set(this.state.data.map(d => d.year))].sort(alphanumericSort);
        const tipos = [...new Set(this.state.data.map(d => d.tipo))].sort(alphanumericSort);
        const edificios = [...new Set(this.state.data.map(d => d.edificio))].sort(alphanumericSort);
        const hhs = [...new Set(this.state.data.map(d => d.hh))].sort(alphanumericSort);
        const zonals = [...new Set(this.state.data.map(d => d.zonal))].sort(alphanumericSort);

        this.populateCheckboxFilter('filter-year', years, 'selectedYears');
        this.populateCheckboxFilter('filter-tipo', tipos, 'selectedTipos');
        this.populateCheckboxFilter('filter-edificio', edificios, 'selectedEdificios');
        this.populateCheckboxFilter('filter-hh', hhs, 'selectedHHs');
        this.populateCheckboxFilter('filter-zonal', zonals, 'selectedZonals');
    }

    populateCheckboxFilter(id, list, stateKey) {
        const container = this.querySelector(`#${id}`);
        container.innerHTML = '';
        list.forEach(val => {
            const label = document.createElement('label');
            label.className = 'filter-item';
            label.innerHTML = `
                <input type="checkbox" value="${val}">
                <span>${val}</span>
            `;
            label.querySelector('input').addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.state[stateKey].push(val);
                } else {
                    this.state[stateKey] = this.state[stateKey].filter(v => v !== val);
                }
                this.state.currentPage = 1;
                this.updateDashboard();
            });
            container.appendChild(label);
        });
    }

    resetFilters() {
        this.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        this.querySelectorAll('.month-btn').forEach(btn => btn.classList.remove('active'));
        this.querySelector('#table-search').value = '';
        
        this.state.selectedYears = [];
        this.state.selectedMonths = [];
        this.state.selectedTipos = [];
        this.state.selectedEdificios = [];
        this.state.selectedHHs = [];
        this.state.selectedZonals = [];
        this.state.searchString = '';
        this.state.currentPage = 1;
        
        this.updateDashboard();
    }

    updateDashboard() {
        this.state.filteredData = this.state.data.filter(d => {
            if (this.state.selectedYears.length > 0 && !this.state.selectedYears.includes(d.year)) return false;
            if (this.state.selectedMonths.length > 0 && !this.state.selectedMonths.includes(d.month)) return false;
            if (this.state.selectedTipos.length > 0 && !this.state.selectedTipos.includes(d.tipo)) return false;
            if (this.state.selectedEdificios.length > 0 && !this.state.selectedEdificios.includes(d.edificio)) return false;
            if (this.state.selectedHHs.length > 0 && !this.state.selectedHHs.includes(d.hh)) return false;
            if (this.state.selectedZonals.length > 0 && !this.state.selectedZonals.includes(d.zonal)) return false;
            return true;
        });

        this.renderKPIs();
        this.renderCharts();
        this.renderTable();
    }

    renderKPIs() {
        const data = this.state.filteredData;
        const totalJobs = data.length;
        const totalNeto = data.reduce((sum, d) => sum + d.monto_neto, 0);
        const totalMargin = data.reduce((sum, d) => sum + d.margin, 0);
        const rentability = totalNeto > 0 ? (totalMargin / totalNeto) * 100 : 0;

        this.querySelector('#kpi-total-trabajos').textContent = totalJobs.toLocaleString('es-CL');
        this.querySelector('#kpi-monto-neto').textContent = this.formatCurrency(totalNeto);
        this.querySelector('#kpi-margen-total').textContent = this.formatCurrency(totalMargin);
        
        const rentEl = this.querySelector('#kpi-rentabilidad-total');
        rentEl.textContent = this.formatPercent(rentability);
        rentEl.style.color = rentability >= 0 ? this.colors.green : this.colors.pink;
    }

    renderCharts() {
        const data = this.state.filteredData;
        this.renderEvolucionTemporal(data);
        this.renderTipoTrabajoPie(data);
        this.renderEdificioInversionMargen(data);
        this.renderEdificioTrabajosCount(data);
        this.renderEncargadoPerformance(data);
        this.renderZonalDistribution(data);
    }

    getCommonOption() {
        return {
            backgroundColor: 'transparent',
            textStyle: { fontFamily: 'Outfit', color: this.colors.textMain },
            tooltip: { 
                trigger: 'axis', 
                backgroundColor: 'rgba(30, 31, 28, 0.9)', 
                borderColor: this.colors.gridLine,
                textStyle: { color: this.colors.textMain }
            },
            grid: { top: '15%', left: '3%', right: '4%', bottom: '15%', containLabel: true }
        };
    }

    renderEvolucionTemporal(data) {
        if (this.state.showTimelineChart) {
            const years = [...new Set(data.map(d => d.year))].filter(y => y && y !== "S/F").sort((a, b) => a - b);
            if (years.length === 0) {
                this.renderStaticEvolucionTemporal(data);
                return;
            }

            const monthsMap = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

            const baseOption = {
                ...this.getCommonOption(),
                timeline: {
                    axisType: 'category',
                    autoPlay: true,
                    playInterval: 1500,
                    top: 45,
                    data: years.map(String),
                    label: { 
                        color: '#ffffff',
                        formatter: (s) => s
                    },
                    lineStyle: { color: this.colors.gridLine },
                    controlStyle: {
                        lineStyle: { color: '#ffffff' },
                        itemStyle: { color: '#ffffff' }
                    }
                },
                grid: { top: '35%', left: '3%', right: '4%', bottom: '15%', containLabel: true },
                legend: { data: ['Inversión Mensual', 'Acumulada'], textStyle: { color: this.colors.textMain } },
                xAxis: { 
                    type: 'category', 
                    data: monthsMap, 
                    axisLine: { lineStyle: { color: this.colors.gridLine } },
                    axisLabel: { color: '#ffffff', overflow: 'break', width: 70 }
                },
                yAxis: [
                    { type: 'value', name: 'Mensual', splitLine: { lineStyle: { color: this.colors.gridLine } }, axisLabel: { formatter: (v) => `$${v/1000000}M`, color: '#ffffff' }, nameTextStyle: { color: '#ffffff' } },
                    { type: 'value', name: 'Acumulado', splitLine: { show: false }, axisLabel: { formatter: (v) => `$${v/1000000}M`, color: '#ffffff' }, nameTextStyle: { color: '#ffffff' } }
                ],
                series: [
                    { name: 'Inversión Mensual', type: 'bar', itemStyle: { color: this.colors.cyan } },
                    { name: 'Acumulada', type: 'line', yAxisIndex: 1, itemStyle: { color: this.colors.green }, lineStyle: { width: 3 } }
                ]
            };

            const options = years.map(year => {
                const yearData = data.filter(d => d.year === year);
                
                const monthlyValues = Array(12).fill(0);
                yearData.forEach(d => {
                    if (d.month >= 1 && d.month <= 12) {
                        monthlyValues[d.month - 1] += d.monto_neto;
                    }
                });

                const cumulativeValues = [];
                let sum = 0;
                monthlyValues.forEach(val => {
                    sum += val;
                    cumulativeValues.push(sum);
                });

                return {
                    title: { 
                        text: `Evolución Inversión - Año ${year}`, 
                        textStyle: { color: '#ffffff', fontSize: 16 },
                        top: 5
                    },
                    series: [
                        { data: monthlyValues },
                        { data: cumulativeValues }
                    ]
                };
            });

            this.charts['chart-evolucion'].setOption({
                baseOption: baseOption,
                options: options
            }, true);

        } else {
            this.renderStaticEvolucionTemporal(data);
        }
    }

    renderStaticEvolucionTemporal(data) {
        const monthly = {};
        data.forEach(d => {
            const key = `${d.year}-${String(d.month).padStart(2, '0')}`;
            monthly[key] = (monthly[key] || 0) + d.monto_neto;
        });
        const sortedKeys = Object.keys(monthly).sort();
        const barData = [];
        const lineData = [];
        let cumulative = 0;
        sortedKeys.forEach(k => {
            cumulative += monthly[k];
            barData.push(monthly[k]);
            lineData.push(cumulative);
        });

        const monthsMap = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const categories = sortedKeys.map(k => {
            const [y, m] = k.split('-');
            if (y === "S/F") return "S/F";
            const monthIdx = parseInt(m) - 1;
            return `${monthsMap[monthIdx] || 'S/I'} ${y}`;
        });

        this.charts['chart-evolucion'].setOption({
            ...this.getCommonOption(),
            legend: { data: ['Inversión Mensual', 'Acumulada'], textStyle: { color: this.colors.textMain } },
            xAxis: { 
                type: 'category', 
                data: categories, 
                axisLine: { lineStyle: { color: this.colors.gridLine } },
                axisLabel: { color: '#ffffff', overflow: 'break', width: 70 }
            },
            yAxis: [
                { 
                    type: 'value', 
                    name: 'Mensual', 
                    nameTextStyle: { color: '#ffffff' },
                    splitLine: { lineStyle: { color: this.colors.gridLine } }, 
                    axisLabel: { formatter: (v) => `$${v/1000000}M`, color: '#ffffff' } 
                },
                { 
                    type: 'value', 
                    name: 'Acumulado', 
                    nameTextStyle: { color: '#ffffff' },
                    splitLine: { show: false }, 
                    axisLabel: { formatter: (v) => `$${v/1000000}M`, color: '#ffffff' } 
                }
            ],
            series: [
                { name: 'Inversión Mensual', type: 'bar', data: barData, itemStyle: { color: this.colors.cyan } },
                { name: 'Acumulada', type: 'line', yAxisIndex: 1, data: lineData, itemStyle: { color: this.colors.green }, lineStyle: { width: 3 } }
            ]
        }, true);
    }

    renderTipoTrabajoPie(data) {
        const grouped = {};
        data.forEach(d => grouped[d.tipo] = (grouped[d.tipo] || 0) + d.monto_neto);
        const seriesData = Object.entries(grouped).map(([name, value]) => ({ name, value }));

        this.charts['chart-tipo'].setOption({
            ...this.getCommonOption(),
            tooltip: { trigger: 'item' },
            legend: { orient: 'horizontal', bottom: 0, textStyle: { color: this.colors.textMain } },
            series: [{
                name: 'Inversión',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 10, borderColor: this.colors.bgCard, borderWidth: 2 },
                label: { show: false },
                emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#fff' } },
                data: seriesData
            }]
        }, true);
    }

    renderEdificioInversionMargen(data) {
        const grouped = {};
        data.forEach(d => {
            if (!grouped[d.edificio]) grouped[d.edificio] = { neto: 0, margin: 0 };
            grouped[d.edificio].neto += d.monto_neto;
            grouped[d.edificio].margin += d.margin;
        });
        const sorted = Object.entries(grouped).sort((a, b) => b[1].neto - a[1].neto).slice(0, 10);
        const categories = sorted.map(s => s[0]);
        const netos = sorted.map(s => s[1].neto);
        const margins = sorted.map(s => s[1].margin);

        this.charts['chart-edificio-monto'].setOption({
            ...this.getCommonOption(),
            legend: { textStyle: { color: this.colors.textMain } },
            xAxis: { type: 'category', data: categories, axisLabel: { interval: 0, color: '#ffffff', overflow: 'break', width: 80 } },
            yAxis: { 
                type: 'value', 
                splitLine: { lineStyle: { color: this.colors.gridLine } }, 
                axisLabel: { 
                    color: '#ffffff',
                    formatter: (v) => `$${v/1000000}M`
                } 
            },
            series: [
                { name: 'Inversión', type: 'bar', data: netos, itemStyle: { color: this.colors.cyan } },
                { name: 'Margen', type: 'bar', data: margins, itemStyle: { color: this.colors.green } }
            ]
        }, true);
    }

    renderEdificioTrabajosCount(data) {
        const grouped = {};
        data.forEach(d => grouped[d.edificio] = (grouped[d.edificio] || 0) + 1);
        const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]).slice(0, 10);
        const categories = sorted.map(s => s[0]);
        const counts = sorted.map(s => s[1]);

        this.charts['chart-edificio-trabajos'].setOption({
            ...this.getCommonOption(),
            xAxis: { type: 'value', splitLine: { lineStyle: { color: this.colors.gridLine } }, axisLabel: { color: '#ffffff' } },
            yAxis: { type: 'category', data: categories.reverse(), axisLabel: { interval: 0, color: '#ffffff' } },
            series: [{ name: 'Cantidad', type: 'bar', data: counts.reverse(), itemStyle: { color: this.colors.purple } }]
        }, true);
    }

    renderEncargadoPerformance(data) {
        const grouped = {};
        data.forEach(d => {
            if (!grouped[d.hh]) grouped[d.hh] = { neto: 0, margin: 0 };
            grouped[d.hh].neto += d.monto_neto;
            grouped[d.hh].margin += d.margin;
        });
        const sorted = Object.entries(grouped).sort((a, b) => b[1].neto - a[1].neto);
        const categories = sorted.map(s => s[0]);
        const netos = sorted.map(s => s[1].neto);
        const margins = sorted.map(s => s[1].margin);

        this.charts['chart-encargado'].setOption({
            ...this.getCommonOption(),
            legend: { textStyle: { color: this.colors.textMain } },
            xAxis: { 
                type: 'value', 
                splitLine: { lineStyle: { color: this.colors.gridLine } }, 
                axisLabel: { 
                    color: '#ffffff',
                    formatter: (v) => `$${v/1000000}M`
                } 
            },
            yAxis: { type: 'category', data: categories.reverse(), axisLabel: { color: '#ffffff' } },
            series: [
                { name: 'Facturación', type: 'bar', data: netos.reverse(), itemStyle: { color: this.colors.orange } },
                { name: 'Margen', type: 'bar', data: margins.reverse(), itemStyle: { color: this.colors.green } }
            ]
        }, true);
    }

    renderZonalDistribution(data) {
        const grouped = {};
        data.forEach(d => grouped[d.zonal] = (grouped[d.zonal] || 0) + d.monto_neto);
        const seriesData = Object.entries(grouped).map(([name, value]) => ({ name, value }));

        this.charts['chart-zonal'].setOption({
            ...this.getCommonOption(),
            tooltip: { trigger: 'item' },
            legend: { orient: 'horizontal', bottom: 0, textStyle: { color: this.colors.textMain } },
            series: [{
                name: 'Inversión',
                type: 'pie',
                radius: '60%',
                data: seriesData,
                itemStyle: { borderRadius: 5 },
                label: {
                    color: '#ffffff',
                    textBorderColor: 'transparent',
                    textBorderWidth: 0
                },
                labelLine: {
                    lineStyle: {
                        color: '#ffffff'
                    }
                }
            }]
        }, true);
    }

    renderTable() {
        const search = this.state.searchString;
        let data = [...this.state.filteredData];

        if (search) {
            data = data.filter(d => d.detalle.toLowerCase().includes(search));
        }

        const field = this.state.sortBy;
        const order = this.state.sortOrder === 'asc' ? 1 : -1;
        data.sort((a, b) => {
            if (a[field] < b[field]) return -1 * order;
            if (a[field] > b[field]) return 1 * order;
            return 0;
        });

        const totalFiltered = data.length;
        const totalPages = Math.ceil(totalFiltered / this.state.itemsPerPage) || 1;
        const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const paginatedData = data.slice(start, start + this.state.itemsPerPage);

        const tbody = this.querySelector('#table-body');
        tbody.innerHTML = paginatedData.map(d => `
            <tr>
                <td>${d.numero_trabajo}</td>
                <td>${d.fecha}</td>
                <td>${d.detalle}</td>
                <td>${d.tipo}</td>
                <td>${d.edificio}</td>
                <td>${d.hh}</td>
                <td>${d.zonal}</td>
                <td style="text-align: right">${this.formatCurrency(d.monto_neto)}</td>
                <td style="text-align: right; color: ${d.margin >= 0 ? this.colors.green : this.colors.pink}">${this.formatCurrency(d.margin)}</td>
                <td style="text-align: right">${this.formatPercent(d.rent)}</td>
            </tr>
        `).join('');

        this.querySelector('#table-count-info').innerHTML = `Mostrando <span>${paginatedData.length}</span> de <span>${totalFiltered}</span> trabajos`;
        this.renderPagination(totalPages);
    }

    renderPagination(totalPages) {
        const container = this.querySelector('#table-pagination');
        container.innerHTML = '';
        
        if (totalPages <= 1) {
            this.querySelector('#table-page-info').innerHTML = '';
            return;
        }

        this.querySelector('#table-page-info').innerHTML = `Página <span>${this.state.currentPage}</span> de <span>${totalPages}</span>`;

        const maxButtons = 5;
        let start = Math.max(1, this.state.currentPage - 2);
        let end = Math.min(totalPages, start + maxButtons - 1);
        if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);

        for (let i = start; i <= end; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === this.state.currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.addEventListener('click', () => {
                this.state.currentPage = i;
                this.renderTable();
            });
            container.appendChild(btn);
        }
    }
}

customElements.define('dashboard-view', DashboardView);
