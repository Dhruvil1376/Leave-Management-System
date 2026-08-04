using Leave_MS.Data;
using Leave_MS.Models;
using Microsoft.AspNetCore.Http;
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
            var cdy = await _context.CalendarYears.ToListAsync();
            return Ok(cdy);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var calendarYear = await _context.CalendarYears.FindAsync(id);

            if (calendarYear == null)
                return NotFound("Calendar Year not found!!!");

            return Ok(calendarYear);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCalendarYear(CalendarYear calendarYear)
        {
            if (await _context.CalendarYears.AnyAsync(c => c.CalendarYearName == calendarYear.CalendarYearName))
                return BadRequest("Calendar Year already exists!!!");

            if (calendarYear.StartDate > calendarYear.EndDate)
                return BadRequest("Start Date cannot be greater than End Date!!!");

            _context.CalendarYears.Add(calendarYear);
            await _context.SaveChangesAsync();

            return Ok(calendarYear);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCalendarYear(int id, CalendarYear calendarYear)
        {
            if (id != calendarYear.CalendarYearId)
                return BadRequest("ID Mismatch!!!");

            var oldCalendarYear = await _context.CalendarYears.FindAsync(id);

            if (oldCalendarYear == null)
                return NotFound("Calendar Year not found!!!");

            if (calendarYear.StartDate > calendarYear.EndDate)
                return BadRequest("Start Date cannot be greater than End Date!!!");

            oldCalendarYear.CalendarYearName = calendarYear.CalendarYearName;
            oldCalendarYear.StartDate = calendarYear.StartDate;
            oldCalendarYear.EndDate = calendarYear.EndDate;

            await _context.SaveChangesAsync();

            return Ok(oldCalendarYear);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCalendarYear(int id)
        {
            var calendarYear = await _context.CalendarYears.FindAsync(id);

            if (calendarYear == null)
                return NotFound("Calendar Year not found.");

            _context.CalendarYears.Remove(calendarYear);
            await _context.SaveChangesAsync();

            return Ok("Deleted Successfully!!!");
        }
    }
}
