using System.Collections.Generic;

namespace InterviewTestPagination.Wrappers
{
    public class PagedResponse<T>
    {
        public IEnumerable<T> Data { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalRecords { get; set; }

        public PagedResponse(IEnumerable<T> data, int pageNumber, int pageSize)
        {
            Data = data;
            PageNumber = pageNumber;
            PageSize = pageSize;
        }
    }
}
