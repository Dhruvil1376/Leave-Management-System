using Leave_MS.Data;
using Leave_MS.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Leave_MS.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatusController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStatus()
        {
            var status=await _context.Statuses.ToListAsync();
            return Ok(status);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStatus(int id)
        {
            var status = await _context.Statuses.FindAsync(id);

            if(status==null)
            {
                return NotFound();
            }

            return Ok(status);

        }

        [HttpPost]
        public async Task<IActionResult> CreateStatus(Status status)
        {
            if (status == null)
                return BadRequest();

            if(await _context.Statuses.AnyAsync(s=> s.StatusName == status.StatusName))
                return BadRequest("Status Already Exists!!!");

            _context.Statuses.Add(status);
            await _context.SaveChangesAsync();

            return Ok(status);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(int id, Status status)
        {
            if (id != status.StatusId)
                return BadRequest("ID Mismatch!!!");

            var oldStatus = await _context.Statuses.FindAsync(id);

            if (oldStatus == null)
                return NotFound("Role not found!!!");

            oldStatus.StatusName = status.StatusName;
            oldStatus.StatusCssClass = status.StatusCssClass;

            await _context.SaveChangesAsync();

            return Ok(oldStatus);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStatus(int id)
        {
            var status = await _context.Statuses.FindAsync(id);

            if (status == null)
                return NotFound("Invalid ID");

            _context.Statuses.Remove(status);
            await _context.SaveChangesAsync();

            return Ok("Status Deleted Successfully!!!");
        }
    }
}
