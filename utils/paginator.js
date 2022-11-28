module.exports = (columns, defaultSortColumn, body) => {
    let pageIndex = 0;
    let pagesize = 10;
    let sortCol = defaultSortColumn;
    let sortOrder = "DESC";
    let searchString = null;

    if (!!body.pageSize && !isNaN(Number(body.pageSize))) {
        pagesize = Number(body.pageSize);
        pagesize = pagesize < 0 ? 10 : pagesize;
    }
    if (!!body.pageIndex && !isNaN(Number(body.pageIndex))) {
        pageIndex = Number(body.pageIndex);
        pageIndex = pageIndex < 0 ? 0 : pageIndex;
    }
    if (!!body.sortCol) {
        if (columns.includes(body.sortCol)) {
            sortCol = body.sortCol;
        }
    }
    if (!!body.sortOrder && ["ASC", "DESC", "asc", "desc"].includes(body.sortOrder)) {
        sortOrder = body.sortOrder;
    }

    if (!!body.searchString) {
        searchString = body.searchString;
        if (searchString === "") {
            searchString = null;
        }
    }

    let offset = pageIndex * pagesize;
    let sort = [
        [sortCol, sortOrder]
    ];
    return {
        offset: offset,
        sort: sort,
        pagesize: pagesize,
        pageIndex: pageIndex,
        searchString: searchString,
    };
};