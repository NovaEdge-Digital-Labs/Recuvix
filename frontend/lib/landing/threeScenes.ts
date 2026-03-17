// All Three.js logic should be safe to run on client side

export function initHeroParticles(container: HTMLElement) {
    const THREE = (window as any).THREE;
    if (!THREE) return () => { };

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Determine if mobile (less particles)
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 800 : 3000;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorWhite = new THREE.Color("#ffffff");
    const colorCyan = new THREE.Color("#00d4ff");
    const colorAccent = new THREE.Color("#e8ff47");

    for (let i = 0; i < particleCount; i++) {
        // Random positions
        positions[i * 3] = (Math.random() - 0.5) * 1200; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1200; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 800; // z

        // Random colors (60% accent, 30% cyan, 10% white)
        const rand = Math.random();
        let c = colorAccent;
        if (rand > 0.6 && rand <= 0.9) c = colorCyan;
        else if (rand > 0.9) c = colorWhite;

        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create a soft circle texture programmatically
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext('2d');
    if (context) {
        const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 16, 16);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
        size: 4,
        vertexColors: true,
        map: texture,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    container.appendChild(renderer.domElement);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Scroll effect
    let scrollY = 0;
    const onScroll = () => {
        scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let animationId: number;
    let time = 0;
    let isUnmounted = false;

    const animate = () => {
        if (isUnmounted) return;
        animationId = requestAnimationFrame(animate);

        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;

        // Optional slightly rotating camera
        camera.lookAt(scene.position);

        const positions = particles.geometry.attributes.position.array as Float32Array;

        // Animate particles
        for (let i = 0; i < particleCount; i++) {
            // Simple drift relative to time
            const initialY = positions[i * 3 + 1];

            // Fast scroll effect -> pushes particles down warp speed
            // Actually, let's keep it simple: drift up and wave
            positions[i * 3 + 1] += 0.2 + (scrollSpeed * 0.5);

            if (positions[i * 3 + 1] > 600) {
                positions[i * 3 + 1] = -600;
            }

            // Slight wave on X
            positions[i * 3] += Math.sin(time + positions[i * 3] * 0.01) * 0.1;
        }

        // Determine scroll speed 
        updateScrollSpeed();

        particles.geometry.attributes.position.needsUpdate = true;

        // Rotate entire system slightly
        particles.rotation.y = time * 0.05;

        renderer.render(scene, camera);
        time += 0.01;
    };

    let lastScrollY = scrollY;
    let scrollSpeed = 0;

    const updateScrollSpeed = () => {
        scrollSpeed = (scrollY - lastScrollY) * 0.1;
        // dampen
        scrollSpeed *= 0.9;
        lastScrollY = scrollY;
    }

    animate();

    const handleResize = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        isUnmounted = true;
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('scroll', onScroll);
        if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
        texture.dispose();
        renderer.dispose();
    };
}

export function initGlobe(container: HTMLElement, triggerSelector?: string) {
    const THREE = (window as any).THREE;
    const gsap = (window as any).gsap;
    if (!THREE) return () => { };

    const w = container.clientWidth || 400;
    const h = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    // Wireframe Globe
    const geometry = new THREE.SphereGeometry(30, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0xe8ff47,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Glowing Core
    const coreGeometry = new THREE.SphereGeometry(15, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xe8ff47,
        transparent: true,
        opacity: 0.15
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    const light = new THREE.PointLight(0xe8ff47, 2, 100);
    scene.add(light);

    // Scale animation via GSAP
    if (gsap && triggerSelector) {
        globe.scale.set(0, 0, 0);
        core.scale.set(0, 0, 0);

        gsap.to([globe.scale, core.scale], {
            x: 1, y: 1, z: 1,
            duration: 1.5,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: triggerSelector,
                start: "top 70%",
            }
        });
    }

    let animationId: number;
    let isUnmounted = false;

    const animate = () => {
        if (isUnmounted) return;
        animationId = requestAnimationFrame(animate);

        globe.rotation.y += 0.002;
        globe.rotation.x += 0.001;
        core.rotation.y -= 0.001;

        renderer.render(scene, camera);
    };

    animate();

    return () => {
        isUnmounted = true;
        cancelAnimationFrame(animationId);
        if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
        coreGeometry.dispose();
        coreMaterial.dispose();
        renderer.dispose();
    };
}

export function initStatsNumbers(container: HTMLElement) {
    const THREE = (window as any).THREE;
    if (!THREE) return () => { };

    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    // Create some floating geometric shapes (Octahedrons/Tetrahedrons)
    const count = 15;
    const meshes: any[] = [];

    for (let i = 0; i < count; i++) {
        const size = Math.random() * 5 + 2;
        const geometry = new THREE.OctahedronGeometry(size, 0);
        const material = new THREE.MeshBasicMaterial({
            color: 0xe8ff47,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 50
        );
        mesh.rotation.set(Math.random(), Math.random(), Math.random());

        scene.add(mesh);
        meshes.push({
            mesh,
            speed: Math.random() * 0.01 + 0.005,
            rotationSpeed: Math.random() * 0.02
        });
    }

    let animationId: number;
    let isUnmounted = false;

    const animate = () => {
        if (isUnmounted) return;
        animationId = requestAnimationFrame(animate);

        meshes.forEach(item => {
            item.mesh.rotation.x += item.rotationSpeed;
            item.mesh.rotation.y += item.rotationSpeed;
            item.mesh.position.y += Math.sin(Date.now() * 0.001 * item.speed) * 0.1;
        });

        renderer.render(scene, camera);
    };

    animate();

    return () => {
        isUnmounted = true;
        cancelAnimationFrame(animationId);
        if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
        meshes.forEach(item => {
            item.mesh.geometry.dispose();
            item.mesh.material.dispose();
        });
        renderer.dispose();
    };
}

export function initIcosahedron(container: HTMLElement, triggerSelector?: string) {
    const THREE = (window as any).THREE;
    const gsap = (window as any).gsap;
    if (!THREE) return () => { };

    const w = container.clientWidth || 500;
    const h = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(35, 1);
    const material = new THREE.MeshBasicMaterial({
        color: 0xe8ff47,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    if (gsap && triggerSelector) {
        mesh.scale.set(0.5, 0.5, 0.5);
        gsap.to(mesh.scale, {
            x: 1.2, y: 1.2, z: 1.2,
            scrollTrigger: {
                trigger: triggerSelector,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });
    }

    let animationId: number;
    let isUnmounted = false;

    const animate = () => {
        if (isUnmounted) return;
        animationId = requestAnimationFrame(animate);

        mesh.rotation.y += 0.001;
        mesh.rotation.x += 0.0005;

        renderer.render(scene, camera);
    };

    animate();

    return () => {
        isUnmounted = true;
        cancelAnimationFrame(animationId);
        if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
        renderer.dispose();
    };
}
