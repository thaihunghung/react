import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "shrimp-weight-tables";

const INITIAL_ROWS = 6;
const INITIAL_COLUMNS = 6;

function createEmptyRow(columnCount) {
  return Array(columnCount).fill("");
}

function createTable() {
  return {
    id: crypto.randomUUID(),
    rows: Array.from(
      { length: INITIAL_ROWS },
      () => createEmptyRow(INITIAL_COLUMNS)
    ),
  };
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function roundNumber(value, decimals = 2) {
  const factor = 10 ** decimals;

  return (
    Math.round((value + Number.EPSILON) * factor) /
    factor
  );
}

function calculateTableTotal(table) {
  return table.rows.reduce((tableTotal, row) => {
    return (
      tableTotal +
      row.reduce(
        (rowTotal, value) => rowTotal + toNumber(value),
        0
      )
    );
  }, 0);
}


/* =====================================================
   TABLE
===================================================== */

function Table({
  table,
  tableIndex,
  onCellChange,
  onAddColumn,
}) {
  const rowCount = table.rows.length;
  const inputRefs = useRef([]);
  const columnCount =
    table.rows.length > 0
      ? table.rows[0].length
      : INITIAL_COLUMNS;

const focusNextInput = (tableId, rowIndex, columnIndex) => {
  const tableInputs = inputRefs.current[tableId];

  if (!tableInputs) return;

  // Xuống hàng tiếp theo
  if (rowIndex + 1 < rowCount) {
    tableInputs[rowIndex + 1]?.[columnIndex]?.focus();
    return;
  }

  // Hết hàng → sang cột tiếp theo
  if (columnIndex + 1 < columnCount) {
    tableInputs[0]?.[columnIndex + 1]?.focus();
  }
};
  const [isCollapsed, setIsCollapsed] = useState(false);
  /**
   * Tổng từng cột.
   */
  const columnTotals = useMemo(() => {
    return Array.from(
      { length: columnCount },
      (_, columnIndex) => {
        const total = table.rows.reduce(
          (sum, row) => {
            return sum + toNumber(row[columnIndex]);
          },
          0
        );

        return roundNumber(total);
      }
    );
  }, [table.rows, columnCount]);

  /**
   * Tổng riêng của bảng.
   */
  const tableTotal = useMemo(() => {
    return roundNumber(
      calculateTableTotal(table)
    );
  }, [table]);

  return (
    <section
      className="
        rounded-xl
        border
        border-gray-200
        bg-white

        p-2

        shadow-sm

        sm:p-0
      "
    >
      {/* =========================================
          HEADER TABLE
      ========================================== */}
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          gap-2

          sm:mb-4
        "
      >
        <div className="min-w-0">
          <h2
            className="
              truncate
              text-xl
              font-bold
              text-gray-900

              sm:text-lg
            "
          >
            Hàng {tableIndex + 1}
          </h2>

          <p
            className="
              text-[11px]
              text-gray-500

              sm:text-xl
            "
          >
            {/* {rowCount} × {columnCount} */}
          </p>
        </div>

          
          
<button
  type="button"
  onClick={() => setIsCollapsed((prev) => !prev)}
  aria-label={isCollapsed ? "Mở bảng" : "Thu gọn bảng"}
  aria-expanded={!isCollapsed}
  className="
    flex
    h-9
    w-9
    shrink-0
    items-center
    justify-center
    text-blue-700
    rounded-lg
    bg-gray-100

    border
border-gray-300
    text-xl
    font-bold
    leading-none


    transition

    

    focus:outline-none
    focus:ring-2

    focus:ring-offset-1



    sm:h-10
    sm:w-10
  "
>
  {isCollapsed ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 5v14M5 12h14"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14"
      />
    </svg>
  )}
</button>
      </div>

      {/* =========================================
          TABLE
      ========================================== */}
      <div
        className="
          w-full
          overflow-x-auto
          rounded-lg
          border
          border-gray-200
        "
      >
        <table
          className="
            w-full
            sm:max-w-[430px]
            border-collapse
          "
        >
          <caption className="sr-only">
            Bảng {tableIndex + 1} nhập khối lượng tôm
          </caption>

          {/* =====================================
              HEADER
          ====================================== */}
          {!isCollapsed && (
          <thead>
            <tr className="bg-gray-100">
              {Array.from(
                { length: columnCount },
                (_, columnIndex) => (
                  <th
                    key={`header-${columnIndex}`}
                    scope="col"
                    className="
                      h-8
                      border-b
                      border-r
                      border-gray-200

                      px-1
                      py-1

                      text-center
                      text-[11px]
                      font-semibold
                      text-gray-700

                      sm:h-10
                      sm:px-2
                      sm:py-2
                      sm:text-xl
                    "
                  >
                    {columnIndex + 1}
                  </th>
                )
              )}
            </tr>
          </thead>
          
          )}
          {/* =====================================
                BODY
            ====================================== */}
          {!isCollapsed && (
            
            <tbody>
              {table.rows.map((row, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className="hover:bg-gray-50"
              >
                {row.map((value, columnIndex) => {
                  const inputId =
                    `table-${table.id}-row-${rowIndex}-column-${columnIndex}`;

                  return (
                    <td
                      key={inputId}
                      className="
                        h-10
                        border-b
                        border-r
                        border-gray-200

                        p-1
                        border-gray-200
                        sm:h-10
                        sm:p-0
                      "
                    >
                      <label
                        htmlFor={inputId}
                        className="sr-only"
                      >
                        Bảng {tableIndex + 1},
                        hàng {rowIndex + 1},
                        cột {columnIndex + 1}
                      </label>

<input
  id={inputId}
  ref={(element) => {
    if (!inputRefs.current[table.id]) {
      inputRefs.current[table.id] = [];
    }

    if (!inputRefs.current[table.id][rowIndex]) {
      inputRefs.current[table.id][rowIndex] = [];
    }

    inputRefs.current[table.id][rowIndex][columnIndex] = element;
  }}
  type="number"
  min="0"
  step="any"
  inputMode="decimal"
  tabIndex={columnIndex * rowCount + rowIndex + 1}
  value={value}
  onChange={(event) =>
    onCellChange(
      table.id,
      rowIndex,
      columnIndex,
      event.target.value
    )
  }
  onKeyDown={(event) => {
    if (
      event.key === "Enter" ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault();

      focusNextInput(
        table.id,
        rowIndex,
        columnIndex
      );
    }
  }}
  aria-label={`Bảng ${
    tableIndex + 1
  }, hàng ${
    rowIndex + 1
  }, cột ${
    columnIndex + 1
  }`}
  placeholder="0"
  className="
    block

    h-8
    w-full

    rounded-md
    border
    border-gray-300

    bg-white

    px-1
    py-1

    text-center
    text-xl
    text-gray-900

    outline-none

    transition

    placeholder:text-gray-400

    hover:border-gray-400

    focus:border-blue-500
    focus:ring-1
    focus:ring-blue-500/30

    sm:h-9
    sm:w-full
    sm:min-w-[10px]

    sm:px-0
    sm:text-xl
  "
/>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
            )}
          {/* =====================================
              TỔNG CỘT
          ====================================== */}
          <tfoot>
            <tr className="bg-blue-50">
              {columnTotals.map((total, columnIndex) => (
                <td
                  key={`total-${columnIndex}`}
                  className="
                    h-9
                    border-r
                    border-gray-200

                    px-1
                    py-1

                    text-center
                    text-xl

                    font-bold
                    text-blue-700

                    sm:h-10
                    sm:px-2
                    sm:py-2
                    sm:text-xl
                  "
                >
                  {total}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* =========================================
          TỔNG RIÊNG CỦA BẢNG
      ========================================== */}
      <div
        aria-live="polite"
        className="
          mt-2
          flex
          items-center
          justify-between

          rounded-lg
          bg-green-50

          px-3
          py-2

          sm:mt-3
          sm:px-4
          sm:py-3
        "
      >
        <span
          className="
            text-xl
            font-semibold
            text-green-800

            sm:text-xl
          "
        >
          Tổng hàng {tableIndex + 1}
        </span>

        <span
          className="
            text-xl
            font-extrabold
            text-green-700

            sm:text-lg
          "
        >
          {tableTotal} kg
        </span>
      </div>
    </section>
  );
}

/* =====================================================
   MAIN
===================================================== */

export default function ShrimpWeightTables() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [price, setPrice] = useState("");
    const [tables, setTables] = useState(() => {
        try {
            const savedTables = localStorage.getItem(STORAGE_KEY);

            if (!savedTables) {
                return [createTable()];
            }

            const parsedTables = JSON.parse(savedTables);

            if (!Array.isArray(parsedTables) || parsedTables.length === 0) {
                return [createTable()];
            }

            return parsedTables;
        } catch (error) {
            console.error("Không thể đọc dữ liệu:", error);
            return [createTable()];
        }
    });
    const handleResetAll = () => {
        const confirmed = window.confirm(
            "Bạn có chắc muốn xóa toàn bộ dữ liệu không?"
        );

        if (!confirmed) return;

        const newTable = createTable();

        setTables([newTable]);
        setPrice("");
        setIsMenuOpen(false);
    };
    useEffect(() => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(tables)
            );
        } catch (error) {
            console.error("Không thể lưu dữ liệu:", error);
        }
    }, [tables]);

  /**
   * Thay đổi input.
   */
  const handleCellChange = (
    tableId,
    rowIndex,
    columnIndex,
    value
  ) => {
    if (value !== "" && Number(value) < 0) {
      return;
    }

    setTables((currentTables) =>
      currentTables.map((table) => {
        if (table.id !== tableId) {
          return table;
        }

        return {
          ...table,

          rows: table.rows.map(
            (row, currentRowIndex) => {
              if (currentRowIndex !== rowIndex) {
                return row;
              }

              return row.map(
                (cell, currentColumnIndex) => {
                  if (
                    currentColumnIndex !==
                    columnIndex
                  ) {
                    return cell;
                  }

                  return value;
                }
              );
            }
          ),
        };
      })
    );
  };

  /**
   * Thêm cột.
   */
  const handleAddColumn = (tableId) => {
    setTables((currentTables) =>
      currentTables.map((table) => {
        if (table.id !== tableId) {
          return table;
        }

        return {
          ...table,

          rows: table.rows.map((row) => [
            ...row,
            "",
          ]),
        };
      })
    );
  };

  /**
   * Thêm bảng.
   */
  const handleAddTable = () => {
    setTables((currentTables) => [
      ...currentTables,
      createTable(),
    ]);
  };

  /**
   * Tổng tất cả bảng.
   */
  const grandTotal = useMemo(() => {
    const total = tables.reduce(
      (sum, table) => {
        return (
          sum +
          calculateTableTotal(table)
        );
      },
      0
    );

    return roundNumber(total);
  }, [tables]);

  const totalMoney = useMemo(() => {
  const kg = Number(grandTotal);
  const pricePerKg = Number(price);

  if (!Number.isFinite(kg) || !Number.isFinite(pricePerKg)) {
    return 0;
  }

  return roundNumber(kg * pricePerKg, 0);
}, [grandTotal, price]);
  return (
    <main
      className="
        min-h-screen
        bg-gray-100

        px-1.5
        pt-[68px]
        pb-[78px]

        sm:px-2
        sm:pt-7
        sm:pb-7
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
        "
      >
        {/* =====================================
            HEADER
        ====================================== */}
        {/* <header className="mb-3 sm:mb-5">
       

          <p
            className="
              mt-0.5
              text-[11px]
              leading-4
              text-gray-500

              sm:mt-1
              sm:text-xl
            "
          >
            Nhập số kg tôm. Tổng cột và tổng bảng
            được tính tự động.
          </p>
        </header> */}

        {/* =====================================
            DANH SÁCH BẢNG
        ====================================== */}
        <div className="space-y-3 sm:space-y-5">
          {tables.map((table, tableIndex) => (
            <Table
              key={table.id}
              table={table}
              tableIndex={tableIndex}
              onCellChange={handleCellChange}
              onAddColumn={handleAddColumn}
            />
          ))}
        </div>
      </div>

      {/* =================================================
          NÚT THÊM BẢNG - FIXED TOP
      ================================================== */}
<div
  className="
    fixed
    inset-x-0
    top-0
    z-50

    border-b
    border-gray-200

    bg-white/95
    shadow-sm
    backdrop-blur-md

    pt-[env(safe-area-inset-top)]
  "
>
  <div
    className="
      relative
      mx-auto
      flex
      h-14
      w-full
      max-w-7xl
      items-center
      justify-between

      px-2

      sm:h-16
      sm:px-4
    "
  >
    {/* Menu */}
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-label="Mở menu"
        aria-expanded={isMenuOpen}
        className="
          flex
          h-10
          w-10
          items-center
          justify-center

          rounded-lg

          text-gray-700

          transition

          hover:bg-gray-100

          focus:outline-none
          focus:ring-2
          focus:ring-gray-300

          active:scale-95
        "
      >
        {/* Icon 3 gạch */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Menu dropdown */}
      {isMenuOpen && (
        <div
          className="
            absolute
            left-0
            top-12
            z-50

            w-44

            overflow-hidden
            rounded-xl
            border
            border-gray-200

            bg-white

            shadow-lg
          "
        >
          <button
            type="button"
            onClick={handleResetAll}
            className="
              flex
              w-full
              items-center
              gap-3

              px-4
              py-3

              text-left
              text-sm
              font-semibold
              text-red-600

              transition

              hover:bg-red-50

              active:bg-red-100
            "
          >
            {/* Icon reset */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-5 w-5 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12a9 9 0 1 0 3-6.7"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4v6h6"
              />
            </svg>

            <span>Reset tất cả</span>
          </button>
        </div>
      )}
    </div>

    {/* Thêm bảng */}
    <button
      type="button"
      onClick={handleAddTable}
      className="
        flex
        min-h-10
        items-center
        justify-center

        rounded-lg

        bg-gray-900

        px-4
        py-2

        text-xl
        font-bold
        text-white

        shadow-sm

        transition

        hover:bg-gray-800

        focus:outline-none
        focus:ring-2
        focus:ring-gray-900
        focus:ring-offset-1

        active:scale-[0.98]

        sm:min-h-11
        sm:px-5
      "
    >
      <span className="mr-1 text-lg leading-none">
        +
      </span>

      Thêm hàng
    </button>
  </div>
</div>

      {/* =================================================
          TỔNG TẤT CẢ BẢNG - FIXED BOTTOM
      ================================================== */}
<section
  aria-label="Tổng tất cả các bảng"
  aria-live="polite"
  className="
    fixed
    inset-x-0
    bottom-0
    z-50

    border-t
    border-gray-200

    bg-white/95
    shadow-[0_-4px_18px_rgba(0,0,0,0.10)]
    backdrop-blur-md

    pt-3
    pb-[calc(12px+env(safe-area-inset-bottom))]

    sm:pt-4
    sm:pb-[calc(14px+env(safe-area-inset-bottom))]
  "
>
  <div
    className="
      mx-auto
      flex
      w-full
      max-w-7xl
      items-center
      justify-center

      gap-2
      px-2

      sm:gap-3
      sm:px-4
    "
  >
    {/* Tổng kg */}
    <div
      className="
        flex
        h-11
        shrink-0
        items-center
        rounded-xl
        border
        border-green-100
        bg-green-50
        px-2.5

        sm:h-12
        sm:px-4
      "
    >
      <span
        className="
          text-lg
          font-extrabold
          leading-none
          text-green-700

          sm:text-2xl
        "
      >
        {grandTotal}
      </span>

      <span
        className="
          ml-1
          text-xl
          font-bold
          text-green-700

          sm:text-xl
        "
      >
        kg
      </span>
    </div>

    {/* Dấu nhân */}
    <span
      className="
        shrink-0
        text-xl
        font-bold
        leading-none
        text-gray-400

        sm:text-2xl
      "
    >
      ×
    </span>

    {/* Số tiền / kg */}
    <input
      type="number"
      min="0"
      step="1"
      inputMode="numeric"
      placeholder="Số tiền"
      value={price}
      onChange={(e) => {
        const value = e.target.value;

        if (value === "") {
          setPrice("");
          return;
        }

        const number = Number(value);

        if (Number.isFinite(number) && number >= 0) {
          setPrice(value);
        }
      }}
      aria-label="Số tiền mỗi kg"
      className="
        h-11
        w-[105px]
        shrink-0

        rounded-xl
        border
        border-gray-300
        bg-white

        px-2

        text-center
        text-xl
        font-bold
        text-gray-800

        outline-none

        transition

        placeholder:text-xl
        placeholder:font-medium
        placeholder:text-gray-400

        focus:border-green-500
        focus:ring-2
        focus:ring-green-100

        sm:h-12
        sm:w-[150px]
        sm:text-xl
      "
    />

    {/* Dấu bằng */}
    <span
      className="
        shrink-0
        text-xl
        font-bold
        leading-none
        text-gray-400

        sm:text-2xl
      "
    >
      =
    </span>

    {/* Thành tiền */}
    <div
      className="
        flex
        h-11
        min-w-0
        shrink-0
        items-center

        rounded-xl
        border
        border-blue-100
        bg-blue-50

        px-2.5

        sm:h-12
        sm:px-4
      "
    >
      <span
        className="
          text-xl
          font-extrabold
          leading-none
          text-blue-700

          sm:text-2xl
        "
      >
        {totalMoney.toLocaleString("vi-VN")}
      </span>

      <span
        className="
          ml-1
          text-xl
          font-bold
          text-blue-700

          sm:text-xl
        "
      >
        đ
      </span>
    </div>
  </div>
</section>
    </main>
  );
}