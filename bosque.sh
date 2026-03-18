#!/bin/bash
# Bosque Recordings Control Script
# Control the Bosque Recordings website

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TRIBE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

case "$1" in
  start)
    echo "🌿 Starting Bosque Recordings..."
    cd "$TRIBE_ROOT"
    docker compose up -d bosque-api bosque-frontend
    
    echo ""
    echo "✅ Bosque Recordings is starting!"
    echo "   🌐 https://bosquerecords.com"
    echo "   🔌 API: https://bosquerecords.com/api/v1"
    echo "   (Wait ~30s for containers to be healthy)"
    ;;
    
  stop)
    echo "🛑 Stopping Bosque Recordings..."
    cd "$TRIBE_ROOT"
    docker compose stop bosque-api bosque-frontend
    echo "✅ Bosque Recordings stopped!"
    ;;
    
  restart)
    echo "🔄 Restarting Bosque Recordings..."
    cd "$TRIBE_ROOT"
    docker compose restart bosque-api bosque-frontend
    echo "✅ Bosque Recordings restarted!"
    ;;
    
  rebuild)
    echo "🔨 Rebuilding Bosque Recordings..."
    cd "$TRIBE_ROOT"
    docker compose stop bosque-api bosque-frontend
    docker compose build --no-cache bosque-api bosque-frontend
    docker compose up -d bosque-api bosque-frontend
    echo "✅ Bosque Recordings rebuilt and started!"
    ;;
    
  status)
    echo "📊 Bosque Recordings Status"
    echo "============================"
    echo ""
    
    if docker ps | grep -q "bosque-frontend"; then
        echo "🟢 Frontend: RUNNING"
    else
        echo "🔴 Frontend: STOPPED"
    fi
    
    if docker ps | grep -q "bosque-api"; then
        if docker ps | grep "bosque-api" | grep -q "healthy"; then
            echo "🟢 API: RUNNING (healthy)"
        else
            echo "🟡 API: RUNNING (starting...)"
        fi
    else
        echo "🔴 API: STOPPED"
    fi
    
    echo ""
    docker ps --filter name=bosque --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    ;;
    
  logs)
    cd "$TRIBE_ROOT"
    if [ -z "$2" ]; then
        docker compose logs -f bosque-api bosque-frontend
    else
        docker compose logs -f "bosque-$2"
    fi
    ;;
    
  db-seed)
    echo "🌱 Seeding Bosque database..."
    docker exec bosque-api bun run db:seed
    echo "✅ Database seeded!"
    ;;
    
  db-studio)
    echo "🗄️  Opening Prisma Studio..."
    echo "   Access at http://localhost:5555"
    docker exec -it bosque-api bunx prisma studio
    ;;
    
  *)
    echo "🌿 Bosque Recordings Control"
    echo "============================="
    echo ""
    echo "Usage: $0 {start|stop|restart|rebuild|status|logs|db-seed|db-studio}"
    echo ""
    echo "Commands:"
    echo "  start     - Start Bosque Recordings"
    echo "  stop      - Stop Bosque Recordings"
    echo "  restart   - Restart services"
    echo "  rebuild   - Rebuild and restart (after code changes)"
    echo "  status    - Show container status"
    echo "  logs      - Show logs (use 'logs api' or 'logs frontend')"
    echo "  db-seed   - Seed the database with sample data"
    echo "  db-studio - Open Prisma Studio for database management"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs api"
    echo "  $0 rebuild"
    exit 1
    ;;
esac
