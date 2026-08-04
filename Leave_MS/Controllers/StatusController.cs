using Leave_MS.Data;
using Leave_MS.Models;
using Leave_MS.DTOs;
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
            var status=await _context.Statuses
                .Select(s => new StatusDTO
                {
                    StatusId = s.StatusId,
                    StatusName = s.StatusName,
                    StatusCssClass = s.StatusCssClass
                })
                .ToListAsync();
            return Ok(status);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStatus(int id)
        {
            var status = await _context.Statuses
                .Where(s => s.StatusId == id)
                .Select(s => new StatusDTO
                {
                    StatusId = s.StatusId,
                    StatusName = s.StatusName,
                    StatusCssClass = s.StatusCssClass
                })
                .FirstOrDefaultAsync();

            if (status == null)
                return NotFound("Status not found!!!");

            return Ok(status);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStatus(StatusDTO status)
        {
            if (status == null)
                return BadRequest("Status data is required!!!");

            if (string.IsNullOrWhiteSpace(status.StatusName))
                return BadRequest("Status name is required!!!");

            if (await _context.Statuses.AnyAsync(s => s.StatusName == status.StatusName))
                return BadRequest("Status already exists!!!");

            var newStatus = new Status()
            {
                StatusName = status.StatusName,
                StatusCssClass = status.StatusCssClass
            };

            _context.Statuses.Add(newStatus);
            await _context.SaveChangesAsync();

            return Ok(newStatus);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(int id, StatusDTO status)
        {
            if (status == null)
                return BadRequest("Status data is required!!!");

            if (string.IsNullOrWhiteSpace(status.StatusName))
                return BadRequest("Status name is required!!!");

            var existingStatus = await _context.Statuses.FindAsync(id);

            if (existingStatus == null)
                return NotFound("Invalid ID");

            existingStatus.StatusName = status.StatusName;
            existingStatus.StatusCssClass = status.StatusCssClass;

            await _context.SaveChangesAsync();

            return Ok(existingStatus);
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