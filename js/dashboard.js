const dashboard_canva = document.querySelector('#dashboard-canva');

const taxa_erro = document.querySelector('#taxa-erro');
const tempo_resposta = document.querySelector('#tempo-resposta');
const usuarios_ativos = document.querySelector('#usuarios-ativos');

document.addEventListener('DOMContentLoaded', () => {
    criar_dashboard();
    mostrar_performance();
});

function mostrar_performance() {
    fetch('./utils/dados.json')
        .then(res => res.json())
        .then(dados => {
            taxa_erro.innerText = dados.performance.errorRate;
            tempo_resposta.innerText = dados.performance.averageResponseTime;
            usuarios_ativos.innerText = dados.performance.activeUsers;
        })
        .catch(err => {
            taxa_erro.innerText = "Erro ao carregar performance";
            tempo_resposta.innerText = "Erro ao carregar performance";
            usuarios_ativos.innerText = "Erro ao carregar performance";
            console.error('Erro ao carregar os dados de performance');
        });
}

async function retornar_dados_sessao() {
    let lista;

    await fetch('./utils/dados.json')
        .then(res => res.json())
        .then(dados => {
            lista = dados.sessions.map(session => {
                session.x = session.date;
                delete session.date;

                session.y = session.count;
                delete session.count;

                return session;
            });

            lista.sort((a, b) => new Date(a.x) - new Date(b.x));

            lista.forEach(session => {
                session.x = session.x.split('-').reverse().join('/');
            });
        });

    return lista;
}

async function criar_dashboard() {
    const options = {
        chart: {
            type: 'line',
            //width: "100%",
            //height: 380,
            foreColor: 'rgb(221, 221, 221)'
        },
        series: [{
            name: 'Sessões',
            data: await retornar_dados_sessao()
        }],
        grid: {
            borderColor: 'rgb(95, 95, 95)',
        },
        xaxis: {
            type: 'category',
        },
        title: {
            text: 'SESSÕES POR DIA',
            align: 'left',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
              fontSize:  '14px',
              fontWeight:  'bold',
              fontFamily:  undefined,
              color:  'rgb(255, 255, 255)'
            },
        },
        markers: {
            size: 5,
            colors: undefined,
            strokeColors: 'rgb(255, 255, 255)',
            strokeWidth: 2,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [],
            shape: "circle",
            offsetX: 0,
            offsetY: 0,
            onClick: undefined,
            onDblClick: undefined,
            showNullDataPoints: true,
            hover: {
                size: undefined,
                sizeOffset: 3
            }
        },
        tooltip: {
            enabled: true,
            enabledOnSeries: undefined,
            shared: true,
            followCursor: false,
            intersect: false,
            inverseOrder: false,
            custom: undefined,
            hideEmptySeries: true,
            fillSeriesColor: false,
            theme: 'dark',
            style: {
              fontSize: '12px',
              fontFamily: undefined,
            },
            onDatasetHover: {
                highlightDataSeries: false,
            },
            x: {
                show: true,
                format: 'dd MMM',
                formatter: undefined,
            },
            y: {
                formatter: undefined,
                title: {
                    formatter: (seriesName) => seriesName,
                },
            },
            z: {
                formatter: undefined,
                title: 'Size: '
            },
            marker: {
                show: true,
            },
            items: {
               display: 'flex',
            },
            fixed: {
                enabled: false,
                position: 'topRight',
                offsetX: 0,
                offsetY: 0,
            },
        }
    }

    const chart = new ApexCharts(dashboard_canva, options);

    chart.render();
}