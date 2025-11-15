import PillNav from "./PillNav";
import logo from "/vailo-logo.svg";

const Navbar = () => {
  return (
    <div className="w-full h-fit p-res-tb p-res-lr">
      <PillNav
        logo={logo}
        logoAlt="Company Logo"
        items={[
          { label: "Home", href: "/home" },
          { label: "Driver", href: "/delivery" },
          { label: "Demo", href: "/demo" },
        ]}
        activeHref="/home"
        className=""
        ease="power2.easeOut"
        baseColor="#000000"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000000"
      />
    </div>
  );
};

export default Navbar;
