{
  description = "BIDs - React web application for ultimate frisbee statistics";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            yarn
            nodePackages.npm
            chromium
            firefox
            jq
            curl
            git
          ];

          shellHook = ''
            # Ensure node_modules/.bin is in PATH
            export PATH="$PWD/node_modules/.bin:$PATH"

            echo "BIDs Frontend Development Environment (Vite)"
            echo "--------------------------------------------"

            # Check if package.json exists
            if [ -f package.json ]; then
              # Check if node_modules exists
              if [ ! -d "node_modules" ]; then
                echo "📦 Installing dependencies..."
                npm install
                echo "✅ Dependencies installed!"
              fi
            fi

            echo ""
            echo "Commands:"
            echo "  npm run dev      - Start development server"
            echo "  npm run build       - Build the project for production"
            echo "  npm run test  - Runs tests using vitest"
            echo ""
            echo "Node: $(node --version)"
            echo "NPM: $(npm --version)"
            echo ""
          '';
        };
      }
    );
}
