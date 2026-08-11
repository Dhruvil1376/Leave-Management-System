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

            return Ok(calendarYears);
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
                return NotFound("Calendar Year not found!!!");

            return Ok(calendarYear);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCalendarYear(
            CalendarYearDTO calendarYear)
        {
            if (calendarYear == null)
                return BadRequest("Calendar Year data is required!!!");

            if (string.IsNullOrWhiteSpace(calendarYear.CalendarYearName))
                return BadRequest("Calendar Year Name is required!!!");

            if (calendarYear.StartDate > calendarYear.EndDate)
                return BadRequest(
                    "Start Date cannot be greater than End Date!!!");

            if (await _context.CalendarYears.AnyAsync(c =>
                c.CalendarYearName == calendarYear.CalendarYearName))
            {
                return BadRequest("Calendar Year already exists!!!");
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

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCalendarYear(
            int id,
            CalendarYearDTO calendarYear)
        {
            if (calendarYear == null)
                return BadRequest("Calendar Year data is required!!!");

            if (id != calendarYear.CalendarYearId)
                return BadRequest("ID Mismatch!!!");

            var oldCalendarYear = await _context.CalendarYears
                .FindAsync(id);

            if (oldCalendarYear == null)
                return NotFound("Calendar Year not found!!!");

            if (calendarYear.StartDate > calendarYear.EndDate)
                return BadRequest(
                    "Start Date cannot be greater than End Date!!!");

            if (await _context.CalendarYears.AnyAsync(c =>
                c.CalendarYearName == calendarYear.CalendarYearName &&
                c.CalendarYearId != id))
            {
                return BadRequest("Calendar Year already exists!!!");
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

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCalendarYear(int id)
        {
            var calendarYear = await _context.CalendarYears
                .FindAsync(id);

            if (calendarYear == null)
                return NotFound("Calendar Year not found!!!");

            _context.CalendarYears.Remove(calendarYear);

            await _context.SaveChangesAsync();

            return Ok("Deleted Successfully!!!");
        }
    }
}