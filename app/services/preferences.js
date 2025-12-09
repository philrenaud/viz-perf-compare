// @ts-check
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const DEFAULT_COUNTRIES = [
  'World Total',
  // 'Canada',
  // 'Mexico',
  // 'Cyprus',
  // 'Argentina',
  // 'Kenya',
  // 'Philippines',
  // 'New Zealand',
  // 'Australia',
];

const DEFAULT_COMMODITIES = [
  'Computers',
  // "Sports apparel and gear",
  // "Wheat",
  // "Corn",
  // "Rice",
  'Nuts',
];

const DEFAULT_YEARS = [
  2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
];

export default class PreferencesService extends Service {
  @service router;

  @action
  updatePreferences() {
    let queryParams = {
      countries: this.countries,
      years: this.years,
      commodities: this.commodities,
      mode: this.mode,
    };

    this.router.transitionTo({ queryParams });
  }

  modes = ['html', 'html-lookup', 'svg', 'canvas'];

  sortOptions = [
    { value: 'alpha-asc', label: 'Alphabetical (A-Z)' },
    { value: 'alpha-desc', label: 'Alphabetical (Z-A)' },
    { value: 'total-desc', label: 'Total Value (High to Low)' },
    { value: 'total-asc', label: 'Total Value (Low to High)' },
    { value: 'growth-desc', label: 'Growth Rate (High to Low)' },
    { value: 'growth-asc', label: 'Growth Rate (Low to High)' },
  ];

  /**
   * @type {("alpha-asc" | "alpha-desc" | "total-desc" | "total-asc" | "growth-desc" | "growth-asc")}
   */
  @tracked sort = 'alpha-asc';

  /**
   * @type {("html" | "html-lookup" | "svg" | "canvas")}
   */
  @tracked mode = 'html-lookup';

  @tracked countries = DEFAULT_COUNTRIES;

  @tracked commodities = DEFAULT_COMMODITIES;

  @tracked years = DEFAULT_YEARS;

  @tracked allYears = DEFAULT_YEARS; // seems safe?

  @tracked allCountries = DEFAULT_COUNTRIES;

  @tracked allCommodities = DEFAULT_COMMODITIES;

  /**
   * @type {("year" | "country")}
   */
  @tracked normalize = 'year';

  /**
   * @param {string} country
   */
  @action toggleCountry(country) {
    if (this.countries.includes(country)) {
      this.countries = this.countries.filter((c) => c !== country).sort();
    } else {
      this.countries = [...this.countries, country].sort();
    }
    this.updatePreferences();
  }

  @action toggleCommodity(commodity) {
    if (this.commodities.includes(commodity)) {
      this.commodities = this.commodities.filter((c) => c !== commodity).sort();
    } else {
      this.commodities = [...this.commodities, commodity].sort();
    }
  }
  @action toggleYear(year) {
    if (this.years.includes(year)) {
      this.years = this.years.filter((c) => c !== year).sort();
    } else {
      this.years = [...this.years, year].sort();
    }
  }

  @tracked focusing = {};

  @tracked comparedData = null;
}
