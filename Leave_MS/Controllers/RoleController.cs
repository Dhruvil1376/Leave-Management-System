using Leave_MS.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Leave_MS.Models;

namespace Leave_MS.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoleController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _context.Roles.ToListAsync();
            return Ok(roles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
            {
                return NotFound();
            }

            return Ok(role);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole(Role role)
        {
            if(role==null)
                return BadRequest();

            if (await _context.Roles.AnyAsync(r => r.RoleName == role.RoleName))
                return BadRequest("Role already exists.");

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            return Ok(role);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, Role role)
        {
            if (id != role.RoleId)
                return BadRequest("ID Mismatch!!!");

            var oldRole = await _context.Roles.FindAsync(id);

            if (oldRole == null)
                return NotFound("Role not found!!!");

            oldRole.RoleName = role.RoleName;
            oldRole.Description = role.Description;
            await _context.SaveChangesAsync();

            return Ok(oldRole);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
                return NotFound("Invalid ID");

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();

            return Ok("Role Deleted Successfully!!!");
        }
    }
}
