import { createSelector } from "reselect";
import { RootState } from "../store";

export const makeSelectBulkCategory = (category: string) =>
  createSelector(
    (state: RootState) => state.bulkCategory,
    (bulkCategory) => {
      const key = category.toLowerCase();

      return {
        status: bulkCategory.status[key] || "idle",
        categories: bulkCategory.categoriesByName[key] || null,
        error: bulkCategory.error[key] || null,
      };
    }
  );
