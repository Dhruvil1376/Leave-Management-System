using Leave_MS.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Leave_MS.Models;
using Leave_MS.DTOs;

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
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _context.Roles
                .Select(r => new RoleDTO
                {
                    RoleId = r.RoleId,
                    RoleName = r.RoleName,
                    Description = r.Description
                })
                .ToListAsync();

            return Ok(roles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRole(int id)
        {
            var role = await _context.Roles
                .Where(r => r.RoleId == id)
                .Select(r => new RoleDTO { 
                    RoleId = r.RoleId,
                    RoleName = r.RoleName,
                    Description = r.Description
                })
                .FirstOrDefaultAsync();

            if (role == null)
            {
                return NotFound("Role not found!!!");
            }

            return Ok(role);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole(RoleDTO role)
        {

            if(role==null)
                return BadRequest("Role Data is Required!!!");

            if (await _context.Roles.AnyAsync(r => r.RoleName == role.RoleName))
                return BadRequest("Role already exists.");

            var newRole = new Role()
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName,
                Description = role.Description
            };

            _context.Roles.Add(newRole);
            await _context.SaveChangesAsync();

            return Ok(newRole);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, RoleDTO role)
        {
            if (id != role.RoleId)
                return BadRequest("ID Mismatch!!!");

            var oldRole = await _context.Roles.FindAsync(id);

            if (oldRole == null)
                return NotFound("Role not found!!!");

            oldRole.RoleName = role.RoleName;
            oldRole.Description = role.Description;
            await _context.SaveChangesAsync();

            var updatedRole = new RoleDTO
            {
                RoleId = oldRole.RoleId,
                RoleName = oldRole.RoleName,
                Description = oldRole.Description
            };

            return Ok(updatedRole);
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
