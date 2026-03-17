"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { GraphData, GraphNode, GraphEdge } from "@/hooks/useLinkingEngine";

interface LinkMapCanvasProps {
    data: GraphData;
    onNodeClick: (id: string) => void;
    className?: string;
}

export function LinkMapCanvas({ data, onNodeClick, className }: LinkMapCanvasProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    // Update dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight || 600,
                });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    useEffect(() => {
        if (!svgRef.current || !data) return;

        const { width, height } = dimensions;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render

        const nodes: any[] = data.nodes.map((d) => ({ ...d }));
        const links: any[] = data.edges.map((d) => ({ ...d }));

        // Simulation setup
        const simulation = d3
            .forceSimulation(nodes)
            .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(40));

        // ZOOM support
        const g = svg.append("g");
        const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
            g.attr("transform", event.transform.toString());
        });
        svg.call(zoom);

        // Arrow markers
        g.append("defs")
            .append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "-0 -5 10 10")
            .attr("refX", 20)
            .attr("refY", 0)
            .attr("orient", "auto")
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("xoverflow", "visible")
            .append("svg:path")
            .attr("d", "M 0,-5 L 10 ,0 L 0,5")
            .attr("fill", "rgba(255,255,255,0.2)")
            .style("stroke", "none");

        // Edges (Links)
        const link = g
            .append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr("stroke", "rgba(255,255,255,0.1)")
            .attr("stroke-width", 1)
            .attr("marker-end", "url(#arrowhead)");

        // Nodes
        const node = g
            .append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(nodes)
            .enter()
            .append("g")
            .attr("cursor", "pointer")
            .on("click", (event, d: any) => onNodeClick(d.id))
            .call(
                d3
                    .drag<any, any>()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)
            );

        // Node Circles
        node
            .append("circle")
            .attr("r", (d: any) => {
                if (d.inboundLinks >= 9) return 20;
                if (d.inboundLinks >= 4) return 16;
                if (d.inboundLinks >= 1) return 12;
                return 8;
            })
            .attr("fill", (d: any) => (d.isOrphan ? "rgba(239, 68, 68, 0.2)" : "rgba(232, 255, 71, 0.7)"))
            .attr("stroke", (d: any) => (d.isOrphan ? "#ef4444" : "#e8ff47"))
            .attr("stroke-width", (d: any) => (d.isOrphan ? 1.5 : 0))
            .attr("stroke-dasharray", (d: any) => (d.isOrphan ? "3,3" : "0"))
            .style("filter", (d: any) => d.inboundLinks >= 5 ? "drop-shadow(0 0 8px rgba(232, 255, 71, 0.4))" : "none");

        // Node Labels (Small text below)
        node
            .append("text")
            .text((d: any) => d.title.length > 20 ? d.title.substring(0, 18) + "..." : d.title)
            .attr("y", (d: any) => (d.inboundLinks >= 9 ? 30 : 25))
            .attr("text-anchor", "middle")
            .attr("fill", "rgba(255,255,255,0.4)")
            .attr("font-size", "9px")
            .attr("font-family", "Inter, sans-serif");

        // Tooltip simulation (Native SVG title for simplicity, can upgrade to custom later)
        node.append("title").text((d: any) => `${d.title}\nIn: ${d.inboundLinks} | Out: ${d.outboundLinks}\n${d.focusKeyword}`);

        // Update positions on tick
        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        });

        // Interaction functions
        function dragstarted(event: d3.D3DragEvent<SVGGElement, any, any>) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event: d3.D3DragEvent<SVGGElement, any, any>) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event: d3.D3DragEvent<SVGGElement, any, any>) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        // Initial positioning: start from center
        nodes.forEach(n => {
            if (!n.x) n.x = width / 2;
            if (!n.y) n.y = height / 2;
        });

        return () => {
            simulation.stop();
        };
    }, [data, dimensions, onNodeClick]);

    return (
        <div ref={containerRef} className={`relative w-full h-[600px] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-zinc-800 ${className}`}>
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                className="block"
            />
        </div>
    );
}
