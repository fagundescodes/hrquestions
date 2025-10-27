using System.Collections.Generic;
using System.Web.Http;
using InterviewTestPagination.Models;
using InterviewTestPagination.Models.Todo;
using System;
using System.Linq;
using InterviewTestPagination.Filter;
using Newtonsoft.Json;

namespace InterviewTestPagination.Controllers
{
    /// <summary>
    /// 'Rest' controller for the <see cref="Todo"/>
    /// model.
    /// 
    /// TODO: implement the pagination Action
    /// </summary>
    public class TodoController : ApiController
    {

        // TODO: [low priority] setup DI 
        private readonly IModelService<Todo> _todoService = new TodoService();

        [HttpGet]
        public IEnumerable<Todo> Todos(int pageNumber = 1, int pageSize = 10, string sortBy = "createdDate", string sortOrder = "desc")
        {
            var validFilter = new PaginationFilter(pageNumber, pageSize);

            var allData = _todoService.Repository.All();

            IEnumerable<Todo> sorted;
            switch (sortBy.ToLower())
            {
                case "id":
                    sorted = sortOrder.ToLower() == "asc"
                        ? allData.OrderBy(t => t.Id)
                        : allData.OrderByDescending(t => t.Id);
                    break;
                case "task":
                    sorted = sortOrder.ToLower() == "asc"
                        ? allData.OrderBy(t => t.Task)
                        : allData.OrderByDescending(t => t.Task);
                    break;
                case "createddate":
                default:
                    sorted = sortOrder.ToLower() == "asc"
                        ? allData.OrderBy(t => t.CreatedDate)
                        : allData.OrderByDescending(t => t.CreatedDate);
                    break;
            }

            var paged = sorted
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();

            var totalRecords = allData.Count();
            var totalPages = (int)Math.Ceiling((double)totalRecords / (double)validFilter.PageSize);

            var metaData = new
            {
                TotalCount = totalRecords,
                PageSize = validFilter.PageSize,
                CurrentPage = validFilter.PageNumber,
                TotalPages = totalPages
            };

            System.Web.HttpContext.Current.Response.Headers.Add("X-Pagination",
                Newtonsoft.Json.JsonConvert.SerializeObject(metaData));

            return paged;
        }
    }
}
