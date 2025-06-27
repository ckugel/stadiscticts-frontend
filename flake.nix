{
  description = "Stadisctics - React web application for ultimate frisbee statistics";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Core Node.js environment
            nodejs_20
            yarn
            nodePackages.npm
            
            # Development browsers
            chromium
            firefox

            # Useful utilities
            jq
            curl
            git
          ];

          shellHook = ''
            # Ensure node_modules/.bin is in PATH
            export PATH="$PWD/node_modules/.bin:$PATH"
            
            echo "Stadisctics Frontend Development Environment"
            echo "--------------------------------------------"
            
            # Check if package.json exists
            if [ -f package.json ]; then
              # Fix the react-scripts version issue
              if grep -q '"react-scripts": "\^0.0.0"' package.json; then
                echo "⚠️  Detected invalid react-scripts version in package.json"
                echo "📦 Installing correct react-scripts version..."
                
                # Install a proper version of react-scripts locally
                npm install --save-dev react-scripts@5.0.1
                
                echo "✅ react-scripts installed successfully!"
              fi
              
              # Check if node_modules exists
              if [ ! -d "node_modules" ]; then
                echo "📦 Installing dependencies..."
                npm install
                echo "✅ Dependencies installed!"
              fi
            fi
            
            echo ""
            echo "Commands:"
            echo "  npm start      - Start development server"
            echo "  npm test       - Run tests"
            echo "  npm run build  - Build for production"
            echo ""
            echo "Node: $(node --version)"
            echo "NPM: $(npm --version)"
            echo ""
            echo "Proxy configured to http://localhost:8080"
          '';
        };
      }
    );
}
