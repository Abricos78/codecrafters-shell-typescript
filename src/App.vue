<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

const API_URL = 'https://api.coinlore.net/api/tickers/?start=0&limit=100';

const columns = [
  { key: 'rank', label: 'Rank', type: 'number' },
  { key: 'name', label: 'Name', type: 'string' },
  { key: 'symbol', label: 'Symbol', type: 'string' },
  { key: 'price_usd', label: 'Price (USD)', type: 'currency' },
  { key: 'market_cap_usd', label: 'Market Cap', type: 'currency' },
  { key: 'volume24', label: 'Volume 24h', type: 'currency' },
  { key: 'percent_change_1h', label: '1h %', type: 'percent' },
  { key: 'percent_change_24h', label: '24h %', type: 'percent' },
  { key: 'percent_change_7d', label: '7d %', type: 'percent' },
  { key: 'csupply', label: 'Circulating Supply', type: 'number' },
];

const numericColumnSet = new Set(
  columns
    .filter((column) => column.type !== 'string')
    .map((column) => column.key),
);

const rows = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

const globalSearch = ref('');
const columnFilters = reactive(
  Object.fromEntries(columns.map((column) => [column.key, ''])),
);

const sortBy = ref('rank');
const sortDirection = ref('asc');

const pageSize = ref(10);
const currentPage = ref(1);

function normalizeValue(value) {
  return String(value ?? '').toLowerCase();
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchCoins() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const payload = await response.json();
    rows.value = Array.isArray(payload.data) ? payload.data : [];
  } catch (error) {
    errorMessage.value = `Failed to load data: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
}

const filteredRows = computed(() => {
  const globalQuery = globalSearch.value.trim().toLowerCase();

  return rows.value.filter((row) => {
    if (globalQuery) {
      const globalMatch = columns.some((column) =>
        normalizeValue(row[column.key]).includes(globalQuery),
      );
      if (!globalMatch) {
        return false;
      }
    }

    return columns.every((column) => {
      const filterValue = columnFilters[column.key].trim().toLowerCase();
      if (!filterValue) {
        return true;
      }

      return normalizeValue(row[column.key]).includes(filterValue);
    });
  });
});

const sortedRows = computed(() => {
  const activeColumn = columns.find((column) => column.key === sortBy.value);
  if (!activeColumn) {
    return filteredRows.value;
  }

  const directionFactor = sortDirection.value === 'asc' ? 1 : -1;
  const sorted = [...filteredRows.value];

  sorted.sort((leftRow, rightRow) => {
    const leftRaw = leftRow[activeColumn.key];
    const rightRaw = rightRow[activeColumn.key];

    if (numericColumnSet.has(activeColumn.key)) {
      const leftNumber = toNumber(leftRaw);
      const rightNumber = toNumber(rightRaw);

      if (leftNumber === null && rightNumber === null) {
        return 0;
      }
      if (leftNumber === null) {
        return 1;
      }
      if (rightNumber === null) {
        return -1;
      }
      return (leftNumber - rightNumber) * directionFactor;
    }

    const leftValue = normalizeValue(leftRaw);
    const rightValue = normalizeValue(rightRaw);
    return leftValue.localeCompare(rightValue) * directionFactor;
  });

  return sorted;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value)),
);

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return sortedRows.value.slice(start, end);
});

const pageNumbers = computed(() =>
  Array.from({ length: totalPages.value }, (_, index) => index + 1),
);

function toggleSort(columnKey) {
  if (sortBy.value === columnKey) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    return;
  }

  sortBy.value = columnKey;
  sortDirection.value = 'asc';
}

function goToPage(page) {
  const safePage = Math.min(totalPages.value, Math.max(1, page));
  currentPage.value = safePage;
}

function getSortIcon(columnKey) {
  if (sortBy.value !== columnKey) {
    return 'v';
  }
  return sortDirection.value === 'asc' ? '^' : 'v';
}

function formatCurrency(value) {
  const numericValue = toNumber(value);
  if (numericValue === null) {
    return '-';
  }

  const maximumFractionDigits = Math.abs(numericValue) >= 1 ? 2 : 6;
  return `$${numericValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits,
  })}`;
}

function formatPercent(value) {
  const numericValue = toNumber(value);
  if (numericValue === null) {
    return '-';
  }

  const sign = numericValue > 0 ? '+' : '';
  return `${sign}${numericValue.toFixed(2)}%`;
}

function formatNumber(value) {
  const numericValue = toNumber(value);
  if (numericValue === null) {
    return '-';
  }

  return numericValue.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  });
}

function formatCell(column, value) {
  if (column.type === 'currency') {
    return formatCurrency(value);
  }
  if (column.type === 'percent') {
    return formatPercent(value);
  }
  if (column.type === 'number') {
    return formatNumber(value);
  }
  return value || '-';
}

function getCellClass(column, value) {
  if (column.type !== 'percent') {
    return '';
  }

  const numericValue = toNumber(value);
  if (numericValue === null || numericValue === 0) {
    return '';
  }

  return numericValue > 0 ? 'text-positive' : 'text-negative';
}

watch(globalSearch, () => {
  currentPage.value = 1;
});

watch(
  columnFilters,
  () => {
    currentPage.value = 1;
  },
  { deep: true },
);

watch([sortBy, sortDirection, pageSize], () => {
  currentPage.value = 1;
});

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages;
  }
});

onMounted(fetchCoins);
</script>

<template>
  <main class="page">
    <header class="page-header">
      <h1>Crypto Currencies Table</h1>
      <p>Data source: Coinlore API</p>
    </header>

    <section class="toolbar">
      <label class="field field-wide">
        <span>Global search</span>
        <input
          v-model.trim="globalSearch"
          type="text"
          placeholder="Search in all cells"
        />
      </label>

      <label class="field">
        <span>Rows per page</span>
        <select v-model.number="pageSize">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </label>

      <button class="refresh-button" :disabled="isLoading" @click="fetchCoins">
        {{ isLoading ? 'Loading...' : 'Refresh data' }}
      </button>
    </section>

    <p v-if="errorMessage" class="status status-error">{{ errorMessage }}</p>
    <p v-else-if="isLoading" class="status">Loading data...</p>
    <p v-else class="status">
      Showing {{ sortedRows.length }} of {{ rows.length }} rows
    </p>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="`sort-${column.key}`">
              <button
                class="sort-button"
                type="button"
                @click="toggleSort(column.key)"
              >
                <span>{{ column.label }}</span>
                <span class="sort-icon">{{ getSortIcon(column.key) }}</span>
              </button>
            </th>
          </tr>
          <tr class="filter-row">
            <th v-for="column in columns" :key="`filter-${column.key}`">
              <input
                v-model.trim="columnFilters[column.key]"
                type="text"
                :placeholder="`Filter ${column.label}`"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!isLoading && paginatedRows.length === 0">
            <td :colspan="columns.length" class="empty-message">
              No rows found for current filters
            </td>
          </tr>
          <tr v-for="row in paginatedRows" :key="row.id">
            <td
              v-for="column in columns"
              :key="`${row.id}-${column.key}`"
              :class="getCellClass(column, row[column.key])"
            >
              {{ formatCell(column, row[column.key]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <footer class="pagination">
      <button
        type="button"
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Prev
      </button>

      <button
        v-for="page in pageNumbers"
        :key="`page-${page}`"
        type="button"
        :class="{ active: page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button
        type="button"
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Next
      </button>

      <span class="page-meta">
        Page {{ currentPage }} / {{ totalPages }}
      </span>
    </footer>
  </main>
</template>
