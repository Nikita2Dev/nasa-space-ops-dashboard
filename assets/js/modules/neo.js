let neoListCache = [];

async function loadNEO() {
  const today = new Date().toISOString().split("T")[0];
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${API_KEY}`;

  try {
    const data = await apiFetch(url);
    
    const dateKeys = Object.keys(data.near_earth_objects || {});
    const rawList = data.near_earth_objects[today] || (dateKeys.length > 0 ? data.near_earth_objects[dateKeys[0]] : []);
    neoListCache = rawList;

    const hazardousCount = rawList.filter(ast => ast.is_potentially_hazardous_asteroid).length;
    document.getElementById('statNeoCount').textContent = rawList.length;
    document.getElementById('statHazardCount').textContent = `${hazardousCount} Potentially Hazardous`;

    renderNeoTable(neoListCache);

    document.getElementById('neoLoading').style.display = 'none';
    document.getElementById('neoTable').style.display = 'table';
  } catch (err) {
    console.error('NEO Error:', err);
    document.getElementById('neoLoading').innerHTML = `<p style="color: var(--danger-red); padding: 12px;">Failed to load asteroid feed. ${err.message}</p>`;
  }
}

function renderNeoTable(list) {
  const tbody = document.getElementById('neoTableBody');
  tbody.innerHTML = '';

  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No matching asteroids found.</td></tr>`;
    return;
  }

  list.forEach(ast => {
    const estMin = Math.round(ast.estimated_diameter.meters.estimated_diameter_min);
    const estMax = Math.round(ast.estimated_diameter.meters.estimated_diameter_max);
    const closeData = ast.close_approach_data[0] || {};
    const velocity = closeData.relative_velocity ? Math.round(closeData.relative_velocity.kilometers_per_hour).toLocaleString() : 'N/A';
    const missDistanceKm = closeData.miss_distance ? Math.round(closeData.miss_distance.kilometers).toLocaleString() : 'N/A';
    const isHazardous = ast.is_potentially_hazardous_asteroid;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${ast.name}</strong></td>
      <td>${estMin} - ${estMax} m</td>
      <td>${velocity} km/h</td>
      <td>${missDistanceKm} km</td>
      <td>
        ${isHazardous 
          ? '<span class="badge badge-danger"><span style="width:6px;height:6px;background:#dc2626;border-radius:50%;display:inline-block;"></span> Hazardous</span>' 
          : '<span class="badge badge-success"><span style="width:6px;height:6px;background:#16a34a;border-radius:50%;display:inline-block;"></span> Safe</span>'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

const btnFilterAllNeo = document.getElementById('btnFilterAllNeo');
if (btnFilterAllNeo) {
  btnFilterAllNeo.addEventListener('click', () => {
    document.getElementById('btnFilterAllNeo').classList.add('active');
    document.getElementById('btnFilterHazardous').classList.remove('active');
    renderNeoTable(neoListCache);
  });
}

const btnFilterHazardous = document.getElementById('btnFilterHazardous');
if (btnFilterHazardous) {
  btnFilterHazardous.addEventListener('click', () => {
    document.getElementById('btnFilterHazardous').classList.add('active');
    document.getElementById('btnFilterAllNeo').classList.remove('active');
    const hazardousList = neoListCache.filter(ast => ast.is_potentially_hazardous_asteroid);
    renderNeoTable(hazardousList);
  });
}
