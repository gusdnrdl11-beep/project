(() => {
  const formatQty = (value) => `${Number(value).toLocaleString('ko-KR')} EA`;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[character]));
  let selectedPo = '12345678';
  let allItems = [];

  function selectRow(row) {
    document.querySelectorAll('.machine-row').forEach((candidate, index) => {
      candidate.classList.remove('bg-sky-50/80', 'border-l-sky-600', 'bg-white', 'bg-slate-50/50');
      candidate.classList.add('border-l-transparent', index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50');
    });
    row.classList.remove('bg-white', 'bg-slate-50/50', 'border-l-transparent');
    row.classList.add('bg-sky-50/80', 'border-l-sky-600');
    selectedPo = row.dataset.po;
    document.getElementById('detail-machine-id').textContent = row.dataset.machine;
    document.getElementById('detail-po').textContent = row.dataset.po;
    document.getElementById('detail-item').textContent = row.dataset.item;
    document.getElementById('detail-plan').textContent = row.dataset.plan;
    document.getElementById('detail-printed').textContent = row.dataset.printed;
    document.getElementById('detail-rate-num').textContent = row.dataset.rate;
    document.getElementById('detail-progress-bar').style.width = `${Math.min(Number(row.dataset.rateRaw), 100)}%`;
  }

  function render(items) {
    const tbody = document.getElementById('machine-table-body');
    tbody.innerHTML = items.map((item, index) => {
      const active = item.po === selectedPo || (!items.some((x) => x.po === selectedPo) && index === 0);
      const rowClass = active
        ? 'bg-sky-50/80 border-l-sky-600'
        : `${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} border-l-transparent hover:bg-slate-50`;
      const printedColor = active ? 'text-emerald-600' : 'text-slate-800';
      return `<tr class="machine-row cursor-pointer transition-colors border-l-4 group ${rowClass}"
        data-machine="${escapeHtml(item.machine)}" data-po="${escapeHtml(item.po)}" data-item="${escapeHtml(item.item)}"
        data-plan="${formatQty(item.plan_qty)}" data-printed="${formatQty(item.printed_qty)}"
        data-rate="${item.progress_rate.toFixed(1)}%" data-rate-raw="${item.progress_rate}">
        <td class="py-space-sm px-space-md font-semibold text-slate-900 flex items-center gap-space-xs"><span>${escapeHtml(item.machine)}</span></td>
        <td class="py-space-sm px-space-md text-sky-700 font-bold">${escapeHtml(item.po)}</td>
        <td class="py-space-sm px-space-md text-slate-700 truncate max-w-[280px]">${escapeHtml(item.item)}</td>
        <td class="py-space-sm px-space-md text-right text-slate-500">${formatQty(item.plan_qty)}</td>
        <td class="py-space-sm px-space-md text-right font-bold ${printedColor}">${formatQty(item.printed_qty)}</td>
        <td class="py-space-sm px-space-md text-center"><div class="flex items-center justify-center gap-space-sm">
          <div class="w-24 bg-slate-200 h-2 rounded-full overflow-hidden p-0.5"><div class="bg-sky-600 h-full rounded-full" style="width:${Math.min(item.progress_rate, 100)}%"></div></div>
          <span class="font-bold text-sky-700 text-label-mono-xs">${item.progress_rate.toFixed(1)}%</span>
        </div></td></tr>`;
    }).join('');

    document.querySelectorAll('.machine-row').forEach((row) => row.addEventListener('click', () => selectRow(row)));
    const selected = [...document.querySelectorAll('.machine-row')].find((row) => row.dataset.po === selectedPo)
      || document.querySelector('.machine-row');
    if (selected) selectRow(selected);

    document.querySelectorAll('span').forEach((span) => {
      if (span.textContent.includes('총 4건 기록')) span.textContent = `총 ${items.length}건 기록`;
      if (span.textContent.includes('1-4 of 4 항목')) span.textContent = items.length ? `1-${items.length} of ${items.length} 항목` : '0건';
    });
  }

  async function loadDashboard(manual = false) {
    const endpoint = manual ? '/api/dashboard/refresh' : '/api/dashboard';
    const response = await fetch(endpoint, { method: manual ? 'POST' : 'GET' });
    if (!response.ok) throw new Error('데이터를 불러오지 못했습니다.');
    const data = await response.json();
    allItems = data.items;
    render(allItems);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const refreshButton = document.querySelector('button[title="수동 데이터 갱신"]');
    refreshButton.onclick = async (event) => {
      event.preventDefault();
      refreshButton.disabled = true;
      try { await loadDashboard(true); } catch (error) { alert(error.message); }
      finally { refreshButton.disabled = false; }
    };

    const search = document.querySelector('input[placeholder="PO 또는 품목 검색..."]');
    search.addEventListener('input', () => {
      const keyword = search.value.trim().toLowerCase();
      render(allItems.filter((item) => `${item.po} ${item.item} ${item.machine}`.toLowerCase().includes(keyword)));
    });

    const csvButton = [...document.querySelectorAll('button')].find((button) => button.textContent.includes('CSV 추출'));
    csvButton.onclick = () => { window.location.href = '/api/dashboard.csv'; };

    loadDashboard().catch((error) => alert(error.message));
    setInterval(() => loadDashboard().catch(console.error), 60_000);
  });
})();
