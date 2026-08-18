using Leave_MS.Data;
using Leave_MS.Models;
using Leave_MS.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Leave_MS.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CalendarYearController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CalendarYearController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCalendarYear()
        {
            var calendarYears = await _context.CalendarYears
                .Select(c => new CalendarYearDTO
                {
                    CalendarYearId = c.CalendarYearId,
                    CalendarYearName = c.CalendarYearName,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<CalendarYearDTO>>
            {
                Success = true,
                Message = "Calendar years retrieved successfully",
                Data = calendarYears
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var calendarYear = await _context.CalendarYears
                .Where(c => c.CalendarYearId == id)
                .Select(c => new CalendarYearDTO
                {
                    CalendarYearId = c.CalendarYearId,
                    CalendarYearName = c.CalendarYearName,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate
                })
                .FirstOrDefaultAsync();

            if (calendarYear == null)
            {
                return NotFound(new ApiResponse<CalendarYearDTO>
                {
                    Success = false,
                    Message = "Calendar Year not found!!!",
                    Data = null
                });
            }

            return Ok(new ApiResponse<CalendarYearDTO>
            {
                Success = true,
                Message = "Calendar year retrieved successfully",
                Data = calendarYear
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCalendarYear(
            CalendarYearDTO calendarYear)
        {
            if (calendarYear == null)
            {
                return BadRequest(new ApiResponse<CalendarYearDTO>
                {
                    Success = false,
                    Message = "Calendar Year data is required!!!",
                    Data = null
                });
            }

            if (string.IsNullOrWhiteSpace(calendarYear.CalendarYearName))
            {
                return BadRequest(new ApiResponse<CalendarYearDTO>
                {
                    Success = false,
                    Message = "Calendar Year Name is required!!!",
                    Data = null
                });
            }

            if (calendarYear.StartDate > calendarYear.EndDate)
            {
                return BadRequest(new ApiResponse<CalendarYearDTO>
                {
                    Success = false,
                    Message = "Start Date cannot be greater than End Date!!!",
                    Data = null
                });
            }

            if (await _context.CalendarYears.AnyAsync(c =>
                c.CalendarYearName == calendarYear.CalendarYearName))
            {
                return BadRequest(new ApiResponse<CalendarYearDTO>
                {
                    Success = false,
                    Message = "Calendar Year already exists!!!",
                    Data = null
                });
            }

            var newCalendarYear = new CalendarYear
            {
                CalendarYearName = calendarYear.CalendarYearName,
                StartDate = calendarYear.StartDate,
                EndDate = calendarYear.EndDate
            };

            _context.CalendarYears.Add(newCalendarYear);
            await _context.SaveChangesAsync();

            var result = new CalendarYearDTO
            {
                CalendarYearId = newCalendarYear.CalendarYearId,
                CalendarYearName = newCalendarYear.CalendarYearName,
                StartDate = newCalendarYear.StartDate,
                EndDate = newCalendarYear.EndDate
            };

            return Ok(new ApiResponse<CalendarYearDTO>
            {
                Success = true,
                Message = "Calendar year created successfully",
                Data = result
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCalendarYear(
            int id,
            CalendarYearDTO calendarYear)
        {
            if (calendarYear == null)
            {
                return BadRequest(new ApiResponse<CalendarYearDTO>
                {
                    Success = false,
                    Message = "Calendar Year data is required!!!",
                    Data = null
                });
            }

            if (id != calendarYear.CalendarYearId)
            {
                return BadRequest(new ApiResponse<CalendarYearDTO>
                {
                    Success = false,
                    Message = "ID Mismatch!!!",
                    Data = null
                });
            }

            var oldCalendarYear = await _context.CalendarYears
                .FindAsync(id);

            if (oldCalendarYear == null)
            {
                return NotFound(new ApiResponse<CalendarYearDTO>
                {
                    Success = false,
                    Message = "Calendar Year not found!!!",
                    Data = null
                });
            }

            if (calendarYear.StartDate > calendarYear.EndDate)
            {
                return BadRequest(new ApiResponse<CalendarYearDTO>
                {
                    Success = false,
                    Message = "Start Date cannot be greater than End Date!!!",
                    Data = null
                });
            }

            if (await _context.CalendarYears.AnyAsync(c =>
                c.CalendarYearName == calendarYear.CalendarYearName &&
                c.CalendarYearId != id))
            {
                return BadRequest(new ApiResponse<CalendarYearDTO>
                {
                    Success = false,
                    Message = "Calendar Year already exists!!!",
                    Data = null
                });
            }

            oldCalendarYear.CalendarYearName =
                calendarYear.CalendarYearName;

            oldCalendarYear.StartDate =
                calendarYear.StartDate;

            oldCalendarYear.EndDate =
                calendarYear.EndDate;

            await _context.SaveChangesAsync();

            var result = new CalendarYearDTO
            {
                CalendarYearId = oldCalendarYear.CalendarYearId,
                CalendarYearName = oldCalendarYear.CalendarYearName,
                StartDate = oldCalendarYear.StartDate,
                EndDate = oldCalendarYear.EndDate
            };

            return Ok(new ApiResponse<CalendarYearDTO>
            {
                Success = true,
                Message = "Calendar year updated successfully",
                Data = result
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCalendarYear(int id)
        {
            var calendarYear = await _context.CalendarYears
                .FindAsync(id);

            if (calendarYear == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Calendar Year not found!!!",
                    Data = null
                });
            }

            _context.CalendarYears.Remove(calendarYear);

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Deleted Successfully!!!",
                Data = null
            });
        }
    }
}